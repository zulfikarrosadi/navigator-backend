# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). *hopefully* h3h3

## v0.2.2 2024-11-07
### Fix
- Change runtime to Node JS because vercel and prisma issues
## v0.2.1 2024-11-06
### Fix
- Change HTTP error code when update link fail
- Change github action workflow file, update DIRECT_URL env variable
- Update links validation schema, trim every user input
## v0.2.0 2024-11-05
### Added
- Add endpoint to update link
- Add endpoint to delete link
- Add endpoint to get links by username
### Fix
- Links can be deleted by their owner

## v0.1.0 2024-11-04
### Added
- Add endpoint to create user account
- Add input validation when create user account
- Add endpoint to add links
- add input validation when add new link
- Prevent anonymous to craete and modify link
- Add login feature