# Presentation Outline for CoU-MIS Project

## Slide 1: Title Slide
- Church of Uganda Management Information System
- CIS 7205 Advanced Database Systems
- Author: [Your Name]
- Date: April 12, 2026

## Slide 2: Background and Problem
- Many Church of Uganda units still use paper records and spreadsheets.
- This causes data errors, slow reporting, weak financial governance, and poor hierarchical visibility.
- The solution needs to support membership, sacraments, financial accountability, and church structure.

## Slide 3: Scope and Objectives
- Design a database-driven system for church operations.
- Support diocesan, archdeaconry, parish, and sub-parish hierarchy.
- Register members and households.
- Record sacraments and financial transactions.
- Build a prototype UI and demonstrate advanced queries.

## Slide 4: Stakeholders
- Bishop and Diocesan Secretary: governance and accountability.
- Archdeacon and Parish Priest: operational oversight.
- Treasurer: financial management.
- Lay Reader and System Administrator: support and system control.
- Church members: accurate sacraments and membership records.

## Slide 5: Functional Requirements
- Manage church hierarchy and organizational units.
- Register households and individual members.
- Maintain sacramental records for baptism, confirmation, marriage.
- Track income and expenses by unit.
- Generate reports and dashboards.

## Slide 6: Non-Functional Requirements
- Security: role-based access and validation.
- Integrity: constraints, foreign keys, and referential integrity.
- Performance: responsive queries and simple UI.
- Scalability: support many parishes and members.
- Reliability: consistent transaction handling.

## Slide 7: Real ER Diagram
- Show the actual ER diagram for CoU-MIS.
- Include all entities: Diocese, Archdeaconry, Parish, SubParish, Household, Member, Sacrament, Transaction, Role, User.
- Include key cardinalities and relationships: Diocese → Archdeaconry → Parish → SubParish → Household → Member.
- Show member-to-sacrament and unit-to-transaction associations.

## Slide 8: Logical Schema and Normalization
- Relational tables defined for each entity.
- Foreign keys enforce hierarchy and relationships.
- Normalized to 3NF to avoid redundancy and update anomalies.
- Separate event tables for sacraments and transactions.

## Slide 9: Database Implementation
- PostgreSQL schema in `Coursework/sql/schema.sql`.
- Includes tables, primary and foreign keys, constraints, and a financial summary view.
- Seed data added for dioceses, parishes, households, members, sacraments, users, and transactions.

## Slide 10: Sample Data and Queries
- Member list with parish and household associations.
- Count members by parish.
- Recent confirmation records.
- Financial rollup by archdeaconry and parish.
- Parish financial summary view.

## Slide 11: Prototype Application
- Node.js/Express backend with REST API.
- Browser UI for CRUD operations.
- Manage members, sacraments, and transactions.
- Live summaries for membership and net balance.

## Slide 12: Security and Integrity
- Role-based access model in logical design.
- Data validation in API requests.
- Foreign keys and check constraints in database schema.
- Unique constraints for users and roles.

## Slide 13: Submission and Deliverables
- `CoU-MIS_Project_Report.docx`
- `CoU-MIS_Presentation.pptx`
- `Coursework/sql/schema.sql`
- `Coursework/sql/sample_queries.sql`
- `Coursework/app/` prototype files
- `Coursework/Submission_Summary.md`

## Slide 14: Conclusion and Future Work
- Improved data accuracy, accountability, and reporting for Church of Uganda.
- Future enhancements: authentication, dashboards, mobile app, certificate printing.
