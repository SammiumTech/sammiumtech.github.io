export interface SchemaDetail {
  name: string;
  classification: "Public" | "Internal" | "Confidential" | "Restricted";
  primaryKey: string;
  description: string;
  drizzleCode: string;
  sqlCode: string;
  domain: string;
}

export const DATABASE_SCHEMAS: Record<string, SchemaDetail> = {
  // --- IDENTITY & ACCESS DOMAIN ---
  users: {
    name: "users",
    domain: "Identity & Access",
    classification: "Confidential",
    primaryKey: "user_id (UUIDv4)",
    description: "Stores authenticated user accounts, encrypted password hashes, and system login descriptors.",
    drizzleCode: `import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: uuid('user_id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at') // Soft Delete
});`,
    sqlCode: `CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;`
  },
  roles: {
    name: "roles",
    domain: "Identity & Access",
    classification: "Restricted",
    primaryKey: "role_id (UUIDv4)",
    description: "Represents user roles (e.g., Administrator, Barangay Staff, Farmer, Auditor) for role-based access control.",
    drizzleCode: `import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  roleId: uuid('role_id').defaultRandom().primaryKey(),
  roleName: varchar('role_name', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 255 })
});`,
    sqlCode: `CREATE TABLE roles (
  role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255)
);`
  },
  permissions: {
    name: "permissions",
    domain: "Identity & Access",
    classification: "Restricted",
    primaryKey: "permission_id (UUIDv4)",
    description: "Stores granular functional clearances to govern screen elements, APIs, and GIS boundary access.",
    drizzleCode: `import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const permissions = pgTable('permissions', {
  permissionId: uuid('permission_id').defaultRandom().primaryKey(),
  permissionKey: varchar('permission_key', { length: 100 }).notNull().unique(),
  description: varchar('description', { length: 255 })
});`,
    sqlCode: `CREATE TABLE permissions (
  permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255)
);`
  },
  sessions: {
    name: "sessions",
    domain: "Identity & Access",
    classification: "Confidential",
    primaryKey: "session_id (UUIDv4)",
    description: "Tracks active web sessions, user-agent devices, and location-derived client IP addresses.",
    drizzleCode: `import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
  sessionId: uuid('session_id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.userId),
  userAgent: varchar('user_agent', { length: 512 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  user_agent VARCHAR(512),
  ip_address VARCHAR(45),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);`
  },
  auth_tokens: {
    name: "auth_tokens",
    domain: "Identity & Access",
    classification: "Restricted",
    primaryKey: "token_id (UUIDv4)",
    description: "Reference hashes for OAuth and third-party API keys (e.g., PAGASA radar API). Never stores secrets in plaintext.",
    drizzleCode: `import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const authTokens = pgTable('auth_tokens', {
  tokenId: uuid('token_id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.userId),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  tokenType: varchar('token_type', { length: 50 }).notNull(), // OAuth, APIRef
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE auth_tokens (
  token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  token_type VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },
  password_resets: {
    name: "password_resets",
    domain: "Identity & Access",
    classification: "Restricted",
    primaryKey: "reset_id (UUIDv4)",
    description: "Stores short-lived, encrypted cryptographic verification tokens used during password recovery flows.",
    drizzleCode: `import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const passwordResets = pgTable('password_resets', {
  resetId: uuid('reset_id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.userId),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE password_resets (
  reset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },

  // --- AGRICULTURE DOMAIN ---
  farmers: {
    name: "farmers",
    domain: "Agriculture",
    classification: "Confidential",
    primaryKey: "farmer_id (UUIDv4)",
    description: "Socio-demographic profiles of certified agricultural operators (RSBSA compliant). Linked directly to core identity.",
    drizzleCode: `import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users';
import { barangays } from '../weather/barangays';

export const farmers = pgTable('farmers', {
  farmerId: uuid('farmer_id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.userId),
  rsbsaCode: varchar('rsbsa_code', { length: 30 }).unique().notNull(),
  contactNumber: varchar('contact_number', { length: 20 }).notNull(),
  barangayUuid: uuid('barangay_uuid').references(() => barangays.uuid),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE farmers (
  farmer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  rsbsa_code VARCHAR(30) UNIQUE NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  barangay_uuid UUID REFERENCES barangays(uuid),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_farmers_rsbsa ON farmers(rsbsa_code);`
  },
  farms: {
    name: "farms",
    domain: "Agriculture",
    classification: "Internal",
    primaryKey: "farm_id (UUIDv4)",
    description: "Geospatial parcel registers. Stores PostGIS spatial Polygon limits representing property shapes.",
    drizzleCode: `import { pgTable, uuid, varchar, decimal, geometry } from 'drizzle-orm/pg-core';
import { farmers } from './farmers';

export const farms = pgTable('farms', {
  farmId: uuid('farm_id').defaultRandom().primaryKey(),
  farmerId: uuid('farmer_id').references(() => farmers.farmerId),
  name: varchar('name', { length: 150 }).notNull(),
  totalAreaHectares: decimal('total_area_hectares', { precision: 10, scale: 2 }).notNull(),
  boundaryGeom: geometry('boundary_geom', { type: 'polygon', srid: 4326 })
});`,
    sqlCode: `CREATE TABLE farms (
  farm_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmers(farmer_id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  total_area_hectares DECIMAL(10, 2) NOT NULL,
  boundary_geom GEOMETRY(Polygon, 4326) -- PostGIS EPSG:4326 WGS 84
);

CREATE INDEX idx_farms_geom ON farms USING GIST(boundary_geom);
CREATE INDEX idx_farms_farmer ON farms(farmer_id);`
  },
  fields: {
    name: "fields",
    domain: "Agriculture",
    classification: "Internal",
    primaryKey: "field_id (UUIDv4)",
    description: "Subdivisions within a farm, defining specific localized soil traits and irrigation valves.",
    drizzleCode: `import { pgTable, uuid, varchar, decimal, geometry } from 'drizzle-orm/pg-core';
import { farms } from './farms';

export const fields = pgTable('fields', {
  fieldId: uuid('field_id').defaultRandom().primaryKey(),
  farmId: uuid('farm_id').references(() => farms.farmId),
  fieldName: varchar('field_name', { length: 100 }).notNull(),
  usableAreaHectares: decimal('usable_area_hectares', { precision: 10, scale: 2 }).notNull(),
  boundaryGeom: geometry('boundary_geom', { type: 'polygon', srid: 4326 })
});`,
    sqlCode: `CREATE TABLE fields (
  field_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(farm_id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  usable_area_hectares DECIMAL(10, 2) NOT NULL,
  boundary_geom GEOMETRY(Polygon, 4326)
);

CREATE INDEX idx_fields_farm ON fields(farm_id);`
  },
  crops: {
    name: "crops",
    domain: "Agriculture",
    classification: "Public",
    primaryKey: "crop_id (UUIDv4)",
    description: "Master taxonomical registry of crop types, botanical classifications, and optimal soil coefficients.",
    drizzleCode: `import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';

export const crops = pgTable('crops', {
  cropId: uuid('crop_id').defaultRandom().primaryKey(),
  commonName: varchar('common_name', { length: 100 }).notNull().unique(),
  scientificName: varchar('scientific_name', { length: 150 }),
  growthDaysAverage: integer('growth_days_average').notNull()
});`,
    sqlCode: `CREATE TABLE crops (
  crop_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  common_name VARCHAR(100) UNIQUE NOT NULL,
  scientific_name VARCHAR(150),
  growth_days_average INTEGER NOT NULL
);`
  },
  crop_cycles: {
    name: "crop_cycles",
    domain: "Agriculture",
    classification: "Internal",
    primaryKey: "cycle_id (UUIDv4)",
    description: "Sowing, planned harvesting, and historic yield records to measure productivity.",
    drizzleCode: `import { pgTable, uuid, date, varchar, decimal } from 'drizzle-orm/pg-core';
import { fields } from './fields';
import { crops } from './crops';

export const cropCycles = pgTable('crop_cycles', {
  cycleId: uuid('cycle_id').defaultRandom().primaryKey(),
  fieldId: uuid('field_id').references(() => fields.fieldId),
  cropId: uuid('crop_id').references(() => crops.cropId),
  plantingDate: date('planting_date').notNull(),
  harvestDatePlanned: date('harvest_date_planned'),
  harvestDateActual: date('harvest_date_actual'),
  yieldMetricTons: decimal('yield_metric_tons', { precision: 10, scale: 2 }),
  currentGrowthStage: varchar('current_growth_stage', { length: 50 }).notNull()
});`,
    sqlCode: `CREATE TABLE crop_cycles (
  cycle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(field_id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(crop_id) ON DELETE RESTRICT,
  planting_date DATE NOT NULL,
  harvest_date_planned DATE,
  harvest_date_actual DATE,
  yield_metric_tons DECIMAL(10, 2),
  current_growth_stage VARCHAR(50) NOT NULL
);

CREATE INDEX idx_cycles_dates ON crop_cycles(planting_date, current_growth_stage);`
  },
  irrigation: {
    name: "irrigation",
    domain: "Agriculture",
    classification: "Internal",
    primaryKey: "irrigation_id (UUIDv4)",
    description: "Logs dynamic irrigation releases, volume in liters, water sources, and cycle durations.",
    drizzleCode: `import { pgTable, uuid, timestamp, decimal, varchar } from 'drizzle-orm/pg-core';
import { fields } from './fields';

export const irrigation = pgTable('irrigation', {
  irrigationId: uuid('irrigation_id').defaultRandom().primaryKey(),
  fieldId: uuid('field_id').references(() => fields.fieldId),
  irrigatedAt: timestamp('irrigated_at').defaultNow().notNull(),
  volumeLiters: decimal('volume_liters', { precision: 12, scale: 2 }).notNull(),
  waterSource: varchar('water_source', { length: 100 }).notNull(), // Canal, River, Deep Well
  durationMinutes: decimal('duration_minutes', { precision: 5, scale: 2 })
});`,
    sqlCode: `CREATE TABLE irrigation (
  irrigation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(field_id) ON DELETE CASCADE,
  irrigated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  volume_liters DECIMAL(12, 2) NOT NULL,
  water_source VARCHAR(100) NOT NULL,
  duration_minutes DECIMAL(5, 2)
);

CREATE INDEX idx_irrigation_field ON irrigation(field_id, irrigated_at DESC);`
  },
  fertilizer_applications: {
    name: "fertilizer_applications",
    domain: "Agriculture",
    classification: "Internal",
    primaryKey: "application_id (UUIDv4)",
    description: "Tracks active fertilizer releases, chemical NPK content indexes, and application mass.",
    drizzleCode: `import { pgTable, uuid, timestamp, varchar, decimal } from 'drizzle-orm/pg-core';
import { fields } from './fields';

export const fertilizerApplications = pgTable('fertilizer_applications', {
  applicationId: uuid('application_id').defaultRandom().primaryKey(),
  fieldId: uuid('field_id').references(() => fields.fieldId),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  fertilizerType: varchar('fertilizer_type', { length: 100 }).notNull(), // Urea, Organic
  amountKg: decimal('amount_kg', { precision: 8, scale: 2 }).notNull(),
  nitrogenPercent: decimal('nitrogen_percent', { precision: 5, scale: 2 })
});`,
    sqlCode: `CREATE TABLE fertilizer_applications (
  application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(field_id) ON DELETE CASCADE,
  applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
  fertilizer_type VARCHAR(100) NOT NULL,
  amount_kg DECIMAL(8, 2) NOT NULL,
  nitrogen_percent DECIMAL(5, 2)
);`
  },
  pest_reports: {
    name: "pest_reports",
    domain: "Agriculture",
    classification: "Internal",
    primaryKey: "report_id (UUIDv4)",
    description: "Records of localized pest infestations. Keeps secure URLs referencing cloud storage assets.",
    drizzleCode: `import { pgTable, uuid, timestamp, varchar, text, jsonb } from 'drizzle-orm/pg-core';
import { fields } from './fields';
import { users } from '../users';

export const pestReports = pgTable('pest_reports', {
  reportId: uuid('report_id').defaultRandom().primaryKey(),
  fieldId: uuid('field_id').references(() => fields.fieldId),
  reportedBy: uuid('reported_by').references(() => users.userId),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  pestType: varchar('pest_type', { length: 100 }).notNull(),
  severityLevel: varchar('severity_level', { length: 30 }).notNull(),
  imageUrl: varchar('image_url', { length: 512 }),
  diagnosticDetails: text('diagnostic_details'),
  aiConfidenceMatrix: jsonb('ai_confidence_matrix')
});`,
    sqlCode: `CREATE TABLE pest_reports (
  report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(field_id) ON DELETE CASCADE,
  reported_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
  detected_at TIMESTAMP NOT NULL DEFAULT NOW(),
  pest_type VARCHAR(100) NOT NULL,
  severity_level VARCHAR(30) NOT NULL,
  image_url VARCHAR(512),
  diagnostic_details TEXT,
  ai_confidence_matrix JSONB
);

CREATE INDEX idx_pest_reports_severity ON pest_reports(severity_level);`
  },
  disease_reports: {
    name: "disease_reports",
    domain: "Agriculture",
    classification: "Internal",
    primaryKey: "disease_report_id (UUIDv4)",
    description: "Plant disease sightings with image attachments and step-by-step remediation suggestions.",
    drizzleCode: `import { pgTable, uuid, timestamp, varchar, text } from 'drizzle-orm/pg-core';
import { fields } from './fields';

export const diseaseReports = pgTable('disease_reports', {
  diseaseReportId: uuid('disease_report_id').defaultRandom().primaryKey(),
  fieldId: uuid('field_id').references(() => fields.fieldId),
  reportedAt: timestamp('reported_at').defaultNow().notNull(),
  diseaseName: varchar('disease_name', { length: 150 }).notNull(),
  imageUrl: varchar('image_url', { length: 512 }),
  remediationAction: text('remediation_action')
});`,
    sqlCode: `CREATE TABLE disease_reports (
  disease_report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(field_id) ON DELETE CASCADE,
  reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  disease_name VARCHAR(150) NOT NULL,
  image_url VARCHAR(512),
  remediation_action TEXT
);`
  },

  // --- WEATHER DOMAIN ---
  municipalities: {
    name: "municipalities",
    domain: "Weather",
    classification: "Public",
    primaryKey: "municipality_id (UUIDv4)",
    description: "Regional municipal administrative borders (e.g., Botolan, Zambales, Philippines).",
    drizzleCode: `import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const municipalities = pgTable('municipalities', {
  municipalityId: uuid('municipality_id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  province: varchar('province', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).default('Philippines').notNull()
});`,
    sqlCode: `CREATE TABLE municipalities (
  municipality_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Philippines'
);`
  },
  barangays: {
    name: "barangays",
    domain: "Weather",
    classification: "Public",
    primaryKey: "uuid (UUIDv4)",
    description: "Sub-municipal administrative polygon layers utilized for geo-targeted early notifications.",
    drizzleCode: `import { pgTable, uuid, varchar, geometry } from 'drizzle-orm/pg-core';
import { municipalities } from './municipalities';

export const barangays = pgTable('barangays', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  municipalityUuid: uuid('municipality_uuid').references(() => municipalities.municipalityId),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).unique().notNull(),
  boundaryGeom: geometry('boundary_geom', { type: 'polygon', srid: 4326 })
});`,
    sqlCode: `CREATE TABLE barangays (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality_uuid UUID REFERENCES municipalities(municipality_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  boundary_geom GEOMETRY(Polygon, 4326)
);

CREATE INDEX idx_barangays_geom ON barangays USING GIST(boundary_geom);`
  },
  weather_records: {
    name: "weather_records",
    domain: "Weather",
    classification: "Public",
    primaryKey: "weather_id (UUIDv4)",
    description: "Hourly, daily, and legacy localized weather metrics caching to avoid API throttles.",
    drizzleCode: `import { pgTable, uuid, timestamp, decimal, varchar } from 'drizzle-orm/pg-core';
import { barangays } from './barangays';

export const weatherRecords = pgTable('weather_records', {
  weatherId: uuid('weather_id').defaultRandom().primaryKey(),
  barangayUuid: uuid('barangay_uuid').references(() => barangays.uuid),
  recordedAt: timestamp('recorded_at').notNull(),
  temperatureCelsius: decimal('temperature_celsius', { precision: 5, scale: 2 }).notNull(),
  humidityPercentage: decimal('humidity_percentage', { precision: 5, scale: 2 }).notNull(),
  precipitationMm: decimal('precipitation_mm', { precision: 7, scale: 2 }).notNull(),
  windSpeedKph: decimal('wind_speed_kph', { precision: 5, scale: 2 }),
  conditionDescription: varchar('condition_description', { length: 150 })
});`,
    sqlCode: `CREATE TABLE weather_records (
  weather_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barangay_uuid UUID REFERENCES barangays(uuid) ON DELETE CASCADE,
  recorded_at TIMESTAMP NOT NULL,
  temperature_celsius DECIMAL(5, 2) NOT NULL,
  humidity_percentage DECIMAL(5, 2) NOT NULL,
  precipitation_mm DECIMAL(7, 2) NOT NULL,
  wind_speed_kph DECIMAL(5, 2),
  condition_description VARCHAR(150)
);

CREATE INDEX idx_weather_recorded_at ON weather_records(barangay_uuid, recorded_at DESC);`
  },

  // --- SOIL DOMAIN ---
  soil_records: {
    name: "soil_records",
    domain: "Soil",
    classification: "Internal",
    primaryKey: "soil_id (UUIDv4)",
    description: "Saves nitrogen, phosphorus, and potassium (NPK) ppm counts, pH metrics, and volumetric moisture.",
    drizzleCode: `import { pgTable, uuid, timestamp, decimal } from 'drizzle-orm/pg-core';
import { fields } from '../agriculture/fields';

export const soilRecords = pgTable('soil_records', {
  soilId: uuid('soil_id').defaultRandom().primaryKey(),
  fieldId: uuid('field_id').references(() => fields.fieldId),
  testedAt: timestamp('tested_at').defaultNow().notNull(),
  nitrogenPpm: decimal('nitrogen_ppm', { precision: 6, scale: 2 }),
  phosphorusPpm: decimal('phosphorus_ppm', { precision: 6, scale: 2 }),
  potassiumPpm: decimal('potassium_ppm', { precision: 6, scale: 2 }),
  soilPh: decimal('soil_ph', { precision: 4, scale: 2 }),
  moisturePercentage: decimal('moisture_percentage', { precision: 5, scale: 2 }).notNull(),
  temperatureCelsius: decimal('temperature_celsius', { precision: 4, scale: 2 })
});`,
    sqlCode: `CREATE TABLE soil_records (
  soil_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(field_id) ON DELETE CASCADE,
  tested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  nitrogen_ppm DECIMAL(6, 2),
  phosphorus_ppm DECIMAL(6, 2),
  potassium_ppm DECIMAL(6, 2),
  soil_ph DECIMAL(4, 2),
  moisture_percentage DECIMAL(5, 2) NOT NULL,
  temperature_celsius DECIMAL(4, 2)
);

CREATE INDEX idx_soil_field_temporal ON soil_records(field_id, tested_at DESC);`
  },

  // --- AI DOMAIN ---
  ai_recommendations: {
    name: "ai_recommendations",
    domain: "AI",
    classification: "Internal",
    primaryKey: "recommendation_id (UUIDv4)",
    description: "Caches Gemini generated advice, prompting context parameters, and overall confidence weights.",
    drizzleCode: `import { pgTable, uuid, text, decimal, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const aiRecommendations = pgTable('ai_recommendations', {
  recommendationId: uuid('recommendation_id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.userId),
  promptContext: text('prompt_context').notNull(),
  aiResponse: text('ai_response').notNull(),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sourcesUsed: jsonb('sources_used')
});`,
    sqlCode: `CREATE TABLE ai_recommendations (
  recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  prompt_context TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  confidence_score DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  sources_used JSONB
);

CREATE INDEX idx_ai_recs_user ON ai_recommendations(user_id);`
  },
  ai_conversations: {
    name: "ai_conversations",
    domain: "AI",
    classification: "Internal",
    primaryKey: "conversation_id (UUIDv4)",
    description: "Maintains multi-turn chat records for on-field dialog support, preventing memory leaks.",
    drizzleCode: `import { pgTable, uuid, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const aiConversations = pgTable('ai_conversations', {
  conversationId: uuid('conversation_id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.userId),
  title: varchar('title', { length: 250 }),
  chatHistory: jsonb('chat_history').notNull(), // Stores chat turn arrays
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE ai_conversations (
  conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(250),
  chat_history JSONB NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },
  ai_feedback: {
    name: "ai_feedback",
    domain: "AI",
    classification: "Internal",
    primaryKey: "feedback_id (UUIDv4)",
    description: "Saves direct farmer ratings and helpfulness signals to guide future recommendations.",
    drizzleCode: `import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { aiRecommendations } from './ai_recommendations';

export const aiFeedback = pgTable('ai_feedback', {
  feedbackId: uuid('feedback_id').defaultRandom().primaryKey(),
  recommendationId: uuid('recommendation_id').references(() => aiRecommendations.recommendationId),
  rating: integer('rating').notNull(), // 1 to 5 stars
  comments: text('comments'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE ai_feedback (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES ai_recommendations(recommendation_id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comments TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },

  // --- COMMUNITY DOMAIN ---
  announcements: {
    name: "announcements",
    domain: "Community",
    classification: "Public",
    primaryKey: "announcement_id (UUIDv4)",
    description: "Disseminates community notices and municipal announcements across target barangays.",
    drizzleCode: `import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { barangays } from '../weather/barangays';

export const announcements = pgTable('announcements', {
  announcementId: uuid('announcement_id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  targetBarangayUuid: uuid('target_barangay_uuid').references(() => barangays.uuid)
});`,
    sqlCode: `CREATE TABLE announcements (
  announcement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMP NOT NULL DEFAULT NOW(),
  target_barangay_uuid UUID REFERENCES barangays(uuid) ON DELETE SET NULL
);`
  },
  community_events: {
    name: "community_events",
    domain: "Community",
    classification: "Public",
    primaryKey: "event_id (UUIDv4)",
    description: "Schedules agricultural training sessions, cooperative workshops, and barangay meetings.",
    drizzleCode: `import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { barangays } from '../weather/barangays';

export const communityEvents = pgTable('community_events', {
  eventId: uuid('event_id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 250 }).notNull(),
  description: text('description'),
  eventDate: timestamp('event_date').notNull(),
  location: varchar('location', { length: 250 }).notNull(),
  barangayUuid: uuid('barangay_uuid').references(() => barangays.uuid)
});`,
    sqlCode: `CREATE TABLE community_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(250) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(250) NOT NULL,
  barangay_uuid UUID REFERENCES barangays(uuid) ON DELETE CASCADE
);`
  },
  community_reports: {
    name: "community_reports",
    domain: "Community",
    classification: "Internal",
    primaryKey: "report_id (UUIDv4)",
    description: "Crowdsourced farmer problem logs (e.g., collapsed irrigation canals, local road washouts).",
    drizzleCode: `import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const communityReports = pgTable('community_reports', {
  reportId: uuid('report_id').defaultRandom().primaryKey(),
  reporterId: uuid('reporter_id').references(() => users.userId),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).default('Pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE community_reports (
  report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },
  surveys: {
    name: "surveys",
    domain: "Community",
    classification: "Public",
    primaryKey: "survey_id (UUIDv4)",
    description: "Maintains active cooperative feedback forms, planting intentions polls, and socio-economic questions.",
    drizzleCode: `import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const surveys = pgTable('surveys', {
  surveyId: uuid('survey_id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  schemaStructure: jsonb('schema_structure').notNull(), // Form inputs blueprint
  expiresAt: timestamp('expires_at')
});`,
    sqlCode: `CREATE TABLE surveys (
  survey_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  schema_structure JSONB NOT NULL,
  expires_at TIMESTAMP
);`
  },

  // --- DISASTER MANAGEMENT DOMAIN ---
  disaster_alerts: {
    name: "disaster_alerts",
    domain: "Disaster Management",
    classification: "Public",
    primaryKey: "alert_id (UUIDv4)",
    description: "Hazard polygons (e.g., flood zones, typhoon tracks) mapped via GIS to raise fast geo-alerts.",
    drizzleCode: `import { pgTable, uuid, varchar, text, timestamp, geometry } from 'drizzle-orm/pg-core';

export const disasterAlerts = pgTable('disaster_alerts', {
  alertId: uuid('alert_id').defaultRandom().primaryKey(),
  alertType: varchar('alert_type', { length: 100 }).notNull(),
  description: text('description').notNull(),
  activatedAt: timestamp('activated_at').notNull(),
  expiresAt: timestamp('expires_at'),
  alertSeverity: varchar('alert_severity', { length: 30 }).notNull(),
  hazardGeom: geometry('hazard_geom', { type: 'polygon', srid: 4326 })
});`,
    sqlCode: `CREATE TABLE disaster_alerts (
  alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  activated_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP,
  alert_severity VARCHAR(30) NOT NULL,
  hazard_geom GEOMETRY(Polygon, 4326)
);

CREATE INDEX idx_alerts_hazard_geom ON disaster_alerts USING GIST(hazard_geom);`
  },
  evacuation_centers: {
    name: "evacuation_centers",
    domain: "Disaster Management",
    classification: "Public",
    primaryKey: "center_id (UUIDv4)",
    description: "Saves official shelters coordinates, contact tags, capacities, and real-time utilization rates.",
    drizzleCode: `import { pgTable, uuid, varchar, integer, geometry } from 'drizzle-orm/pg-core';

export const evacuationCenters = pgTable('evacuation_centers', {
  centerId: uuid('center_id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 250 }).notNull(),
  maxCapacity: integer('max_capacity').notNull(),
  currentOccupancy: integer('current_occupancy').default(0).notNull(),
  locationGeom: geometry('location_geom', { type: 'point', srid: 4326 })
});`,
    sqlCode: `CREATE TABLE evacuation_centers (
  center_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(250) NOT NULL,
  max_capacity INTEGER NOT NULL,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  location_geom GEOMETRY(Point, 4326)
);

CREATE INDEX idx_evac_centers_geom ON evacuation_centers USING GIST(location_geom);`
  },

  // --- NOTIFICATIONS DOMAIN ---
  notifications: {
    name: "notifications",
    domain: "Notifications",
    classification: "Confidential",
    primaryKey: "notification_id (UUIDv4)",
    description: "Delivers direct notifications, weather anomalies, and crop alerts with read status tracking.",
    drizzleCode: `import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const notifications = pgTable('notifications', {
  notificationId: uuid('notification_id').defaultRandom().primaryKey(),
  recipientId: uuid('recipient_id').references(() => users.userId),
  title: varchar('title', { length: 150 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);`
  },
  sms_queue: {
    name: "sms_queue",
    domain: "Notifications",
    classification: "Confidential",
    primaryKey: "sms_id (UUIDv4)",
    description: "Maintains outbound GSM message text payloads, target phone tags, and retry counts.",
    drizzleCode: `import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const smsQueue = pgTable('sms_queue', {
  smsId: uuid('sms_id').defaultRandom().primaryKey(),
  phoneNumber: varchar('phone_number', { length: 25 }).notNull(),
  message: text('message').notNull(),
  retryCount: integer('retry_count').default(0).notNull(),
  status: varchar('status', { length: 30 }).default('queued').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE sms_queue (
  sms_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(25) NOT NULL,
  message TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },
  email_queue: {
    name: "email_queue",
    domain: "Notifications",
    classification: "Confidential",
    primaryKey: "email_id (UUIDv4)",
    description: "Holds municipal bulletins and security advisory emails to prevent mailer stalls.",
    drizzleCode: `import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const emailQueue = pgTable('email_queue', {
  emailId: uuid('email_id').defaultRandom().primaryKey(),
  recipientEmail: varchar('recipient_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  bodyText: text('body_text').notNull(),
  status: varchar('status', { length: 30 }).default('queued').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE email_queue (
  email_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body_text TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },

  // --- ANALYTICS DOMAIN ---
  dashboard_stats: {
    name: "dashboard_stats",
    domain: "Analytics",
    classification: "Internal",
    primaryKey: "stat_id (UUIDv4)",
    description: "Caches aggregate metrics (e.g., active crop hectares, average municipal yield metrics).",
    drizzleCode: `import { pgTable, uuid, varchar, integer, decimal, timestamp } from 'drizzle-orm/pg-core';

export const dashboardStats = pgTable('dashboard_stats', {
  statId: uuid('stat_id').defaultRandom().primaryKey(),
  statKey: varchar('stat_key', { length: 100 }).notNull().unique(),
  intValue: integer('int_value'),
  decValue: decimal('dec_value', { precision: 12, scale: 2 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE dashboard_stats (
  stat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key VARCHAR(100) UNIQUE NOT NULL,
  int_value INTEGER,
  dec_value DECIMAL(12, 2),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },
  yield_history: {
    name: "yield_history",
    domain: "Analytics",
    classification: "Public",
    primaryKey: "history_id (UUIDv4)",
    description: "Aggregates crop seasonal yields per municipality over year limits to gauge agricultural health.",
    drizzleCode: `import { pgTable, uuid, varchar, integer, decimal } from 'drizzle-orm/pg-core';

export const yieldHistory = pgTable('yield_history', {
  historyId: uuid('history_id').defaultRandom().primaryKey(),
  cropType: varchar('crop_type', { length: 100 }).notNull(),
  harvestYear: integer('harvest_year').notNull(),
  totalTons: decimal('total_tons', { precision: 12, scale: 2 }).notNull(),
  hectaresCultivated: decimal('hectares_cultivated', { precision: 10, scale: 2 }).notNull(),
  municipalityName: varchar('municipality_name', { length: 150 }).notNull()
});`,
    sqlCode: `CREATE TABLE yield_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_type VARCHAR(100) NOT NULL,
  harvest_year INTEGER NOT NULL,
  total_tons DECIMAL(12, 2) NOT NULL,
  hectares_cultivated DECIMAL(10, 2) NOT NULL,
  municipality_name VARCHAR(150) NOT NULL
);

CREATE INDEX idx_yield_history_metrics ON yield_history(crop_type, harvest_year);`
  },

  // --- SECURITY & AUDIT DOMAIN ---
  audit_logs: {
    name: "audit_logs",
    domain: "Security & Audit",
    classification: "Restricted",
    primaryKey: "audit_id (UUIDv4)",
    description: "Appends highly secure, immutable action traces for system-wide auditing and legal compliance reporting.",
    drizzleCode: `import { pgTable, uuid, timestamp, varchar, text, jsonb } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const auditLogs = pgTable('audit_logs', {
  auditId: uuid('audit_id').defaultRandom().primaryKey(),
  actorId: uuid('actor_id').references(() => users.userId),
  actionType: varchar('action_type', { length: 100 }).notNull(),
  resourceTarget: varchar('resource_target', { length: 100 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  metadataPayload: jsonb('metadata_payload')
});`,
    sqlCode: `CREATE TABLE audit_logs (
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL,
  resource_target VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata_payload JSONB
);

CREATE INDEX idx_audit_temporal ON audit_logs(timestamp DESC);`
  },
  security_events: {
    name: "security_events",
    domain: "Security & Audit",
    classification: "Restricted",
    primaryKey: "event_id (UUIDv4)",
    description: "Records of high-level threat flags, brute-force detections, and WAF blocks for immediate auditing.",
    drizzleCode: `import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const securityEvents = pgTable('security_events', {
  eventId: uuid('event_id').defaultRandom().primaryKey(),
  severity: varchar('severity', { length: 30 }).notNull(), // CRITICAL, WARNING
  eventType: varchar('event_type', { length: 100 }).notNull(), // SQLi, XSS, BruteForce
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE security_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity VARCHAR(30) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },
  login_attempts: {
    name: "login_attempts",
    domain: "Security & Audit",
    classification: "Restricted",
    primaryKey: "attempt_id (UUIDv4)",
    description: "Audits auth trials to enforce rate-limiting thresholds and block sequential rogue inputs.",
    drizzleCode: `import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const loginAttempts = pgTable('login_attempts', {
  attemptId: uuid('attempt_id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  isSuccess: boolean('is_success').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`,
    sqlCode: `CREATE TABLE login_attempts (
  attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  is_success BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`
  },

  // --- SYSTEM CONFIGURATION DOMAIN ---
  settings: {
    name: "settings",
    domain: "System Configuration",
    classification: "Restricted",
    primaryKey: "setting_id (UUIDv4)",
    description: "Saves global system flags, weather warning thresholds, and dynamic pricing rules.",
    drizzleCode: `import { pgTable, uuid, varchar, jsonb } from 'drizzle-orm/pg-core';

export const settings = pgTable('settings', {
  settingId: uuid('setting_id').defaultRandom().primaryKey(),
  configKey: varchar('config_key', { length: 100 }).notNull().unique(),
  configValue: jsonb('config_value').notNull()
});`,
    sqlCode: `CREATE TABLE settings (
  setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL
);`
  }
};
