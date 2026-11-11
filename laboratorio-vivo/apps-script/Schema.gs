/** Generated from contracts/sheets-schema.json; keep headers in sync. */
var LV_TABLES_ = {
  "Config": {
    "headers": [
      "config_key",
      "config_value",
      "value_type",
      "version",
      "approval_status",
      "updated_at",
      "updated_by"
    ],
    "primary_key": [
      "config_key"
    ]
  },
  "Atividades": {
    "headers": [
      "activity_id",
      "activity_version",
      "lesson_id",
      "stage",
      "track_id",
      "title",
      "kind",
      "official_item_id",
      "official_max",
      "xp_max",
      "criteria_version",
      "schema_version",
      "status",
      "questions_json",
      "updated_at"
    ],
    "primary_key": [
      "activity_id",
      "activity_version"
    ]
  },
  "Rubricas": {
    "headers": [
      "rubric_id",
      "criteria_version",
      "activity_id",
      "criterion_id",
      "label",
      "evaluation_type",
      "max_points",
      "weight",
      "status",
      "approved_by",
      "approved_at"
    ],
    "primary_key": [
      "rubric_id",
      "criteria_version",
      "criterion_id"
    ]
  },
  "Equipes": {
    "headers": [
      "team_id",
      "display_name",
      "track_id",
      "status",
      "created_at"
    ],
    "primary_key": [
      "team_id"
    ]
  },
  "Participantes": {
    "headers": [
      "participant_id",
      "team_id",
      "display_name",
      "role",
      "status",
      "authorship_validated",
      "created_at"
    ],
    "primary_key": [
      "participant_id"
    ]
  },
  "Submissoes": {
    "headers": [
      "submission_id",
      "request_id",
      "payload_hash",
      "activity_id",
      "activity_version",
      "criteria_version",
      "team_id",
      "participant_id",
      "revision",
      "previous_submission_id",
      "status",
      "created_at",
      "updated_at",
      "formative_xp"
    ],
    "primary_key": [
      "submission_id"
    ]
  },
  "Respostas": {
    "headers": [
      "response_id",
      "submission_id",
      "question_id",
      "answer_kind",
      "value",
      "review_status"
    ],
    "primary_key": [
      "response_id"
    ]
  },
  "Avaliacoes_Docente": {
    "headers": [
      "evaluation_id",
      "submission_id",
      "participant_id",
      "criterion_id",
      "criteria_version",
      "score",
      "decision",
      "reviewer_id",
      "justification",
      "revision",
      "created_at"
    ],
    "primary_key": [
      "evaluation_id"
    ]
  },
  "Notas_3a_Etapa": {
    "headers": [
      "participant_id",
      "item_a",
      "decision_a",
      "item_b",
      "decision_b",
      "item_c",
      "decision_c",
      "total",
      "plan_version",
      "plan_status",
      "updated_at",
      "source_evaluation_ids"
    ],
    "primary_key": [
      "participant_id"
    ]
  },
  "Notas_4a_Etapa": {
    "headers": [
      "participant_id",
      "item_a",
      "decision_a",
      "item_b",
      "decision_b",
      "item_c",
      "decision_c",
      "total",
      "plan_version",
      "plan_status",
      "updated_at",
      "source_evaluation_ids"
    ],
    "primary_key": [
      "participant_id"
    ]
  },
  "Progresso": {
    "headers": [
      "progress_id",
      "team_id",
      "participant_id",
      "activity_id",
      "activity_version",
      "status",
      "formative_xp",
      "pending_count",
      "last_submission_id",
      "updated_at"
    ],
    "primary_key": [
      "progress_id"
    ]
  },
  "Auditoria": {
    "headers": [
      "event_id",
      "event_at",
      "actor_id",
      "actor_role",
      "operation",
      "entity_id",
      "outcome",
      "request_id",
      "payload_hash",
      "detail_code"
    ],
    "primary_key": [
      "event_id"
    ]
  },
  "Idempotencia": {
    "headers": [
      "idempotency_key",
      "request_id",
      "actor_id",
      "operation",
      "payload_hash",
      "state",
      "receipt_json",
      "created_at",
      "updated_at"
    ],
    "primary_key": [
      "idempotency_key"
    ]
  },
  "Conflitos": {
    "headers": [
      "conflict_id",
      "request_id",
      "actor_id",
      "operation",
      "expected_hash",
      "received_hash",
      "status",
      "created_at",
      "resolution_code",
      "resolved_by",
      "resolved_at"
    ],
    "primary_key": [
      "conflict_id"
    ]
  },
  "Verificacao_QA": {
    "headers": [
      "case_id",
      "title",
      "expected",
      "actual",
      "status",
      "executed_at",
      "evidence_ref"
    ],
    "primary_key": [
      "case_id"
    ]
  }
};
