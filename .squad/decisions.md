# Squad Decisions

## Active Decisions

### Documentation Priority: 1.2.x Release Coverage

**Status:** Active  
**Owner:** Mal  
**Date:** 2026-04-14

#### Summary

1.2.x release cycle introduces massive new features (Wyoming Voice Platform, Conversation Command Parser, Personality Prompt, Pluggable Data Providers) but documentation significantly lags. Analysis of 74 existing doc pages reveals:

- **8 HIGH priority broken/misleading pages** (users cannot follow setup or understand features)
- **5 new pages required** (Wyoming Platform, Conversation API, Personality config, Data Providers, Command Patterns)
- **7 medium priority feature gaps** (Activity metrics, orchestrator routing, voice dashboard, HA deployment)

#### Critical Issues Blocking Users

1. **HA Integration Broken** — `docs/home-assistant/configuration.md` describes old agent selection flow; now uses `/api/conversation` REST endpoint
2. **REST API Incomplete** — `docs/api/rest-api.md` missing `/api/conversation` endpoint group
3. **Data Provider Config Missing** — `docs/reference/environment-variables.md` and `docs/reference/configuration.md` lack data provider settings
4. **Wyoming Platform Undocumented** — No dedicated docs for speech pipeline, speaker verification, dashboard
5. **Docker Deployment Outdated** — `docs/deployment/docker-compose.md` shows mandatory Redis/MongoDB; should be optional
6. **Orchestrator Rules Incomplete** — `docs/agents/orchestrator-agent.md` missing 1.2.1 routing improvements

#### Phase 1: Critical Path (2-3 weeks)

1. Create Wyoming Voice Platform page
2. Create Conversation Command Parser page
3. Update HA configuration docs
4. Update REST API docs
5. Update deployment docker-compose examples
6. Update environment variables reference

#### Phase 2: Feature Documentation (1-2 weeks)

7. Create Response Templates page
8. Create Pluggable Data Providers page
9. Update orchestrator routing rules (1.2.1)
10. Update activity dashboard metrics

#### Phase 3: Polish & Enhancement (1 week)

11. Update architecture overview diagrams
12. Create Command Pattern Matcher reference
13. Update deployment comparison guides
14. Extend data provider sections to K8s/Helm/systemd

#### Work Estimate

| Priority | Count | Impact | Hours |
|---|---|---|---|
| Critical | 8 files | Blocks user adoption | 12-16 |
| High | 5 pages | Undocumented features | 20-24 |
| Medium | 7 files | Feature gaps | 10-14 |
| Low | 8 files | Nice-to-have | 4-6 |
| **Total** | **28 items** | **46-60 hours** | — |

#### Key Recommendations

- **For Product:** Voice and command parsing are marketed features; need strong docs to support adoption
- **For Crew:** Start with HA config and REST API; these unblock everything else
- **For Docs Contributor:** Use release notes as source of truth; reference `/mnt/games/github/lucia-dotnet` for implementation

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
