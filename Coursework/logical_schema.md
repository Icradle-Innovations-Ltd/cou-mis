# Logical Design and Normalization

## Relational Schema

### Diocese
- `diocese_id` SERIAL PRIMARY KEY
- `name` VARCHAR(150) NOT NULL
- `province` VARCHAR(100)
- `address` TEXT

### Archdeaconry
- `archdeaconry_id` SERIAL PRIMARY KEY
- `diocese_id` INTEGER NOT NULL REFERENCES Diocese(diocese_id)
- `name` VARCHAR(150) NOT NULL
- `location` TEXT

### Parish
- `parish_id` SERIAL PRIMARY KEY
- `archdeaconry_id` INTEGER NOT NULL REFERENCES Archdeaconry(archdeaconry_id)
- `name` VARCHAR(150) NOT NULL
- `address` TEXT

### SubParish
- `subparish_id` SERIAL PRIMARY KEY
- `parish_id` INTEGER NOT NULL REFERENCES Parish(parish_id)
- `name` VARCHAR(150) NOT NULL
- `address` TEXT

### Household
- `household_id` SERIAL PRIMARY KEY
- `subparish_id` INTEGER NOT NULL REFERENCES SubParish(subparish_id)
- `household_name` VARCHAR(200) NOT NULL
- `head_name` VARCHAR(150)

### Member
- `member_id` SERIAL PRIMARY KEY
- `household_id` INTEGER NOT NULL REFERENCES Household(household_id)
- `first_name` VARCHAR(100) NOT NULL
- `last_name` VARCHAR(100) NOT NULL
- `date_of_birth` DATE
- `gender` VARCHAR(20)
- `phone` VARCHAR(30)
- `email` VARCHAR(150)
- `membership_status` VARCHAR(50) NOT NULL DEFAULT 'Active'

### Sacrament
- `sacrament_id` SERIAL PRIMARY KEY
- `member_id` INTEGER NOT NULL REFERENCES Member(member_id)
- `sacrament_type` VARCHAR(50) NOT NULL
- `sacrament_date` DATE NOT NULL
- `location` VARCHAR(200)
- `officiant` VARCHAR(150)

### Transaction
- `transaction_id` SERIAL PRIMARY KEY
- `unit_type` VARCHAR(30) NOT NULL
- `unit_id` INTEGER NOT NULL
- `transaction_date` DATE NOT NULL
- `amount` NUMERIC(12,2) NOT NULL CHECK (amount >= 0)
- `transaction_type` VARCHAR(30) NOT NULL
- `description` TEXT

### Role
- `role_id` SERIAL PRIMARY KEY
- `name` VARCHAR(80) NOT NULL UNIQUE
- `description` TEXT

### User
- `user_id` SERIAL PRIMARY KEY
- `username` VARCHAR(100) NOT NULL UNIQUE
- `password_hash` TEXT NOT NULL
- `role_id` INTEGER NOT NULL REFERENCES Role(role_id)
- `assigned_unit_type` VARCHAR(30)
- `assigned_unit_id` INTEGER
- `email` VARCHAR(150)

## Normalization Justification

- All tables contain atomic attributes with no repeating groups.
- Each non-key attribute depends only on the primary key of its table.
- Referential integrity is enforced using foreign keys.
- The membership and sacrament models separate member details from events, avoiding update anomalies.
- Transactions are stored separately from organizational units, using `unit_type` and `unit_id` for flexible assignment.

## Notes on 3NF

- No transitive dependencies exist within each table.
- Information such as diocesan names is stored in the Diocese table only, not duplicated in Archdeaconry/Parish.
- The model supports hierarchical roll-up queries without denormalizing the schema.
