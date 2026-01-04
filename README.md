
  # Responsive UI for UNPER

  This is a code bundle for Responsive UI for UNPER. The original project is available at https://www.figma.com/design/EzcvRkMvTbICdXTNgBDDE1/Responsive-UI-for-UNPER.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

 # Unified National Electoral Roll (UNPER) System

A centralized, secure, and legally compliant platform for managing a Unified National Electoral Roll, inspired by the Election Commission of India’s UNPER initiative.
The system integrates database-driven voter management, AI/ML-based duplicate detection, and blockchain-backed auditability.

## 📌 Problem Statement

India’s electoral rolls are traditionally maintained at the state level, leading to:

Duplication during inter-state migration

Delays in voter roll updates

Limited transparency and auditability

Risk of inconsistencies across jurisdictions

This project proposes a single national source of truth for electoral data while preserving legally mandated workflows such as Form-6 migration approvals.

## 🎯 Objectives

Maintain one national identity per elector

Support legal voter migration without duplicate voting

Enable role-based electoral administration

## System Architecture

Frontend (Web UI)
        |
Backend APIs
        |
Unified Electoral Database (Core)
        |           |
     AI/ML       Blockchain
 (Dedup/DSE)   (Audit Hashes)


Preserve audit trails and data integrity

Support multilingual electoral rolls

Provide clean integration points for AI/ML and Blockchain
