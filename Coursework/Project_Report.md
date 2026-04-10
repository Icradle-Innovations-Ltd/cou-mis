# Church of Uganda MIS Project Report

## 1. Introduction

This document presents the design and implementation of a Management Information System for the Church of Uganda. The solution was developed as part of CIS 7205 Advanced Database Systems and demonstrates requirements analysis, ER modeling, normalization, database implementation, querying, application development, and security enforcement.

## 2. Background and Problem Definition

Organizations in Uganda continue to rely on manual systems such as paper registers and spreadsheets to manage church operations. For the Church of Uganda, this results in:
- fragmented membership and sacramental records,
- delays in financial reporting,
- data inconsistencies across parishes,
- limited accountability for diocesan governance.

The proposed system addresses these challenges by providing a unified database-driven platform that supports hierarchical structure, sacramental history, and financial transparency.

## 3. Objectives and Scope

The main objectives of this coursework are to:
- analyze real-world data requirements for church management,
- model the organization using ER diagrams,
- define a relational schema normalized to at least Third Normal Form,
- implement the database using PostgreSQL,
- build a functional prototype interface,
- demonstrate advanced SQL queries and reporting capabilities.

The scope includes hierarchy management, member registration, sacramental records, financial transactions, reporting, and basic prototype UI functionality.

## 4. Stakeholders

The key stakeholders for the Church of Uganda MIS are:
- Bishop: strategic oversight and governance,
- Diocesan Secretary: coordination and reporting,
- Archdeacon: supervision of archdeaconries,
- Parish Priest: parish administration,
- Treasurer: financial stewardship,
- Lay Reader: parish support and record assistance,
- System Administrator: system maintenance and security,
- Church members: beneficiaries of accurate records.

## 5. Requirements

### Functional Requirements
- Define dioceses, archdeaconries, parishes, and sub-parishes.
- Register households and individual members.
- Record sacraments such as baptisms and confirmations.
- Track income and expenses for organizational units.
- Enable summary reports for membership and finances.
- Provide a simple user interface for CRUD operations.

### Non-Functional Requirements
- Security through role-based access control and validation.
- Data integrity with primary keys, foreign keys, and constraints.
- Performance suitable for responsive queries and reporting.
- Scalability to support multiple dioceses and large membership.
- Reliability through consistent transaction handling.

## 6. Conceptual Design and ER Modeling

The conceptual model includes the following entities:
- Diocese, Archdeaconry, Parish, SubParish,
- Household, Member, Sacrament, Transaction,
- Role, User.

Relationships capture the hierarchical church structure and the connections between members, sacramental records, and financial transactions. The main hierarchy is:

Diocese → Archdeaconry → Parish → SubParish → Household → Member

Sacrament records are associated with members, while financial transactions are associated with organizational units.

## 7. Logical Design and Normalization

The model was converted to a relational schema and normalized to 3NF. Each table has a clearly defined primary key and non-key attributes that depend only on that key. Referential integrity is enforced using foreign keys.

### Normalization Highlights
- No repeating groups are stored within tables.
- Member details are separated from sacramental events.
- Transaction data is stored independently of organizational unit definitions.
- Role and user tables isolate access control information from functional data.

## 8. Database Implementation

The implementation uses PostgreSQL and includes:
- tables for each entity,
- primary keys and foreign keys,
- data types appropriate for names, dates, amounts, and descriptions,
- check constraints for financial amounts,
- a reusable view for parish financial summaries.

The SQL schema is available in `Coursework/sql/schema.sql`.

## 9. Advanced Querying

Advanced querying demonstrates:
- multi-table joins across the church hierarchy,
- aggregate functions such as SUM and COUNT,
- correlated subqueries for financial rollup,
- views for dashboard-ready summaries.

Example queries include member counts by parish, recent confirmations, and net financial balances by unit.

## 10. Prototype Application

A simple Node.js/Express prototype demonstrates practical CRUD operations for:
- members,
- sacramental records,
- financial transactions.

The prototype uses an in-memory data store for rapid demonstration and is accessible through a web browser. Implementation files are located in `Coursework/app/`.

## 11. Security and Data Integrity

Security and data integrity are supported through:
- role-based tables for access control,
- referential integrity with foreign keys,
- validation rules in the prototype API,
- constraints such as non-null fields and value checks.

These measures ensure reliable data entry and prevent inconsistent records.

## 12. Submission Deliverables

The following deliverables are included for this coursework:
- `CoU-MIS_Project_Report.docx`
- `CoU-MIS_Presentation.pptx`
- `Coursework/sql/schema.sql`
- `Coursework/sql/sample_queries.sql`
- `Coursework/app/` prototype files
- supporting documentation in markdown files

## 13. Final Checklist

- [x] Requirements Analysis: problem, stakeholders, system requirements.
- [x] Conceptual Design: ER diagram entities, attributes, relationships.
- [x] Logical Design: relational schema and normalization to 3NF.
- [x] Database Implementation: create tables, keys, constraints in PostgreSQL.
- [x] Advanced Querying: joins, subqueries, aggregations, views.
- [x] Application Development: browser UI and CRUD operations.
- [x] Security & Integrity: access control design, constraints, data validation.
- [x] Submission Package: report, presentation, SQL files, prototype files.

## 14. Conclusion

This Church of Uganda MIS project meets the CIS 7205 coursework requirements by delivering a complete database design and a working prototype. The solution is ready for submission and provides strong coverage of real-world database concepts, normalization, advanced querying, and application development.
