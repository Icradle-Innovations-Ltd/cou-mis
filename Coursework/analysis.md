# Requirements Analysis for CoU-MIS

## Project Problem Statement

The Church of Uganda currently relies on outdated and manual record-keeping systems to manage diocesan governance, sacramental records, membership, and financial accountability. These inefficient processes cause data inaccuracies, slow reporting, poor transparency, and weak hierarchical management.

## Real-World Problem Being Solved

Design and implement a database-driven Management Information System for the Church of Uganda that:
- supports diocesan, archdeaconry, parish, and sub-parish hierarchies,
- manages membership and sacramental history,
- records financial transactions,
- enables hierarchical reporting and accountability,
- enforces data integrity and access control.

## Key Stakeholders

- Bishop
- Diocesan Secretary
- Archdeacon
- Parish Priest
- Lay Reader
- Treasurer
- System Administrator
- Church members and households

## Functional Requirements

1. Hierarchy management
   - Define dioceses, archdeaconries, parishes, and sub-parishes.
   - Assign users and roles to organizational units.
   - Support hierarchical reporting and roll-up summaries.

2. Membership management
   - Register individual church members.
   - Track membership lifecycle events such as baptism, confirmation, and household affiliation.

3. Sacramental registry
   - Record baptism and confirmation details.
   - Store sacramental events as immutable records.
   - Produce certificates and print-ready sacramental summaries.

4. Financial management
   - Record income and expenses by unit.
   - Capture quotas, gifts, and donations.
   - Generate financial reports per parish, archdeaconry, and diocese.

5. Reporting and analytics
   - Provide parish and diocesan dashboards.
   - Support summary and detailed reports.

## Non-Functional Requirements

1. Security
   - Role-based access control (RBAC).
   - User authentication with token-based sessions.
   - Input validation and constraints.

2. Performance
   - Dashboard pages should load in under 2 seconds.
   - Queries must be optimized for hierarchical lookups.

3. Scalability
   - Support thousands of parishes and members.
   - Enable growth to multi-tenant deployment.

4. Reliability
   - Provide high uptime and consistent transaction handling.

## Coursework Task Mapping

| Coursework Task | Approach in this solution |
|---|---|
| Requirements Analysis | Documented problem, stakeholders, functional and non-functional requirements |
| Conceptual Design | ER model with entities and relationships |
| Logical Design | Relational schema normalized to 3NF |
| Implementation | PostgreSQL DDL and simple prototype API/UI |
| Advanced Querying | Sample SQL queries with joins, aggregates, subqueries, views |
| Application Development | Basic Node.js/Express prototype UI for CRUD operations |
| Security and Integrity | Primary keys, foreign keys, constraints, role table, validation in API |
