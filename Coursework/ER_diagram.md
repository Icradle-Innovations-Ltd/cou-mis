# Conceptual Design: ER Model for CoU-MIS

This file contains the real ER diagram logic for the Church of Uganda MIS, with entities, attributes, and relationships.

## Entities and Attributes

- **Diocese**
  - `diocese_id` (PK)
  - `name`
  - `province`
  - `address`

- **Archdeaconry**
  - `archdeaconry_id` (PK)
  - `diocese_id` (FK)
  - `name`
  - `location`

- **Parish**
  - `parish_id` (PK)
  - `archdeaconry_id` (FK)
  - `name`
  - `address`

- **SubParish**
  - `subparish_id` (PK)
  - `parish_id` (FK)
  - `name`
  - `address`

- **Household**
  - `household_id` (PK)
  - `subparish_id` (FK)
  - `household_name`
  - `head_name`

- **Member**
  - `member_id` (PK)
  - `household_id` (FK)
  - `first_name`
  - `last_name`
  - `date_of_birth`
  - `gender`
  - `phone`
  - `email`
  - `membership_status`

- **Sacrament**
  - `sacrament_id` (PK)
  - `member_id` (FK)
  - `sacrament_type`
  - `sacrament_date`
  - `location`
  - `officiant`

- **Transaction**
  - `transaction_id` (PK)
  - `unit_type`
  - `unit_id`
  - `transaction_date`
  - `amount`
  - `transaction_type`
  - `description`

- **Role**
  - `role_id` (PK)
  - `name`
  - `description`

- **User**
  - `user_id` (PK)
  - `username`
  - `password_hash`
  - `role_id` (FK)
  - `assigned_unit_type`
  - `assigned_unit_id`
  - `email`

## Relationships

- Diocese 1..* Archdeaconry
- Archdeaconry 1..* Parish
- Parish 1..* SubParish
- SubParish 1..* Household
- Household 1..* Member
- Member 1..* Sacrament
- Unit (Diocese/Archdeaconry/Parish/SubParish) 1..* Transaction
- Role 1..* User

## ER Diagram (Mermaid)

```mermaid
erDiagram
    DIOCESE {
        int diocese_id PK
        string name
        string province
        string address
    }
    ARCHDEACONRY {
        int archdeaconry_id PK
        int diocese_id FK
        string name
        string location
    }
    PARISH {
        int parish_id PK
        int archdeaconry_id FK
        string name
        string address
    }
    SUBPARISH {
        int subparish_id PK
        int parish_id FK
        string name
        string address
    }
    HOUSEHOLD {
        int household_id PK
        int subparish_id FK
        string household_name
        string head_name
    }
    MEMBER {
        int member_id PK
        int household_id FK
        string first_name
        string last_name
        date date_of_birth
        string gender
        string phone
        string email
        string membership_status
    }
    SACRAMENT {
        int sacrament_id PK
        int member_id FK
        string sacrament_type
        date sacrament_date
        string location
        string officiant
    }
    TRANSACTION {
        int transaction_id PK
        string unit_type
        int unit_id
        date transaction_date
        decimal amount
        string transaction_type
        string description
    }
    ROLE {
        int role_id PK
        string name
        string description
    }
    USER {
        int user_id PK
        string username
        string password_hash
        int role_id FK
        string assigned_unit_type
        int assigned_unit_id
        string email
    }

    DIOCESE ||--o{ ARCHDEACONRY : "has"
    ARCHDEACONRY ||--o{ PARISH : "has"
    PARISH ||--o{ SUBPARISH : "has"
    SUBPARISH ||--o{ HOUSEHOLD : "has"
    HOUSEHOLD ||--o{ MEMBER : "includes"
    MEMBER ||--o{ SACRAMENT : "has"
    ROLE ||--o{ USER : "grants"
    USER }o--|| ROLE : "assigned"
```

## Notes

- `Transaction` is intentionally flexible using `unit_type` and `unit_id` so it can reference different levels of church administration.
- The hierarchy supports roll-up reporting from SubParish up to Diocese.
- `User` records contain both role and assigned unit information for access control mapping.
