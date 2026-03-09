---
sidebar_position: 7
title: Lists Agent
---

# Lists Agent

The Lists Agent manages todo and reminder lists. It provides a natural-language interface for creating, updating, and querying lists stored in Lucia's database.

## Capabilities

| Action | Example Utterance |
|---|---|
| Create list | "Create a grocery list" |
| Add item | "Add milk to the grocery list" |
| Remove item | "Remove eggs from the grocery list" |
| Check off item | "Mark milk as done" |
| View list | "What's on my grocery list?" |
| View all lists | "Show me my lists" |
| Delete list | "Delete the grocery list" |
| Add reminder | "Remind me to call the dentist tomorrow" |

## List Types

The Lists Agent supports two list types:

### Todo Lists

Persistent lists with checkable items. Items can be marked as complete or incomplete.

```
Grocery List
  [ ] Milk
  [x] Bread
  [ ] Eggs
  [ ] Coffee
```

### Reminder Lists

Time-based items that trigger a notification at a specified time. Reminders are stored as list items with an associated datetime.

```
Reminders
  [ ] Call the dentist — Tomorrow 2:00 PM
  [ ] Pick up dry cleaning — Friday 5:00 PM
```

:::info
Reminder notifications are delivered through the satellite speaker that was active when the reminder was created. If no satellite context is available, the reminder appears in the dashboard.
:::

## Tool Functions

### `create_list`

Creates a new named list.

```json
{
  "name": "Grocery List",
  "type": "todo"
}
```

### `add_item`

Adds an item to an existing list.

```json
{
  "list_name": "Grocery List",
  "item": "Milk",
  "due_date": null
}
```

For reminders, include a due date:

```json
{
  "list_name": "Reminders",
  "item": "Call the dentist",
  "due_date": "2026-03-05T14:00:00"
}
```

### `remove_item`

Removes an item from a list.

```json
{
  "list_name": "Grocery List",
  "item": "Eggs"
}
```

### `check_item`

Marks an item as complete or incomplete.

```json
{
  "list_name": "Grocery List",
  "item": "Bread",
  "checked": true
}
```

### `get_list`

Returns all items in a list with their status.

```json
{
  "list_name": "Grocery List",
  "items": [
    { "item": "Milk", "checked": false },
    { "item": "Bread", "checked": true },
    { "item": "Eggs", "checked": false }
  ]
}
```

### `get_all_lists`

Returns all lists with item counts.

```json
{
  "lists": [
    { "name": "Grocery List", "type": "todo", "item_count": 4, "completed_count": 1 },
    { "name": "Reminders", "type": "reminder", "item_count": 2, "completed_count": 0 }
  ]
}
```

### `delete_list`

Deletes a list and all its items.

```json
{
  "list_name": "Grocery List"
}
```

## Example Interaction

```
User: "Add bananas and yogurt to the grocery list"

Orchestrator -> ListsAgent

ListsAgent:
  1. Resolves "grocery list" -> list_id: "grocery-list"
  2. Calls add_item for "Bananas"
  3. Calls add_item for "Yogurt"
  4. Responds: "Added Bananas and Yogurt to your Grocery List."
```

## Default Instructions

The following system prompt is sent to the LLM when the Lists Agent handles a request:

```text
You are a Lists Agent for a Home Assistant smart home.

Your responsibilities:
- Add items to the Home Assistant shopping list (groceries, items to buy)
- Add items to todo lists (tasks, reminders)
- List shopping list items or todo list items when asked

Use AddToShoppingListAsync for "add X to shopping list" or "add X to groceries".
Use AddToTodoListAsync when the user specifies a todo list (entity like todo.grocery
or todo.personal_tasks). Call ListTodoEntitiesAsync first if the user asks to add to
"todo" without specifying which list.
Use ListShoppingItemsAsync when the user asks what's on the shopping list.
Use ListTodoItemsAsync when the user asks what's on a specific todo list.

Keep responses short and confirm what was added.
```

## Dashboard

Lists can also be viewed and managed from the [Lists](/docs/dashboard/lists-page) page in the dashboard, which provides a visual interface for editing items, reordering, and bulk operations.

## Configuration

The Lists Agent stores data in the Lucia MongoDB database. No additional configuration is required beyond the standard connection strings in your deployment.
