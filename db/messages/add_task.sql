
INSERT INTO messages (
    message_text,
    user_id,
    room_id,
    ts_added,
    is_task,
    assigned_to,
    due_date,
    is_complete
    )
VALUES (
    ${message_text},
    ${user_id},
    ${room_id},
    ${ts_added},
    ${is_task},
    ${assigned_to},
    ${due_date},
    ${is_complete}
)
RETURNING
    message_text,
    user_id,
    room_id,
    ts_added,
    is_task,
    assigned_to,
    due_date,
    is_complete;