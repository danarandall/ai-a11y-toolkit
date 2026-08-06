# Build brief

This is the product specification given to both builders. It is identical for
both arms and contains no accessibility guidance, no accessibility vocabulary,
and no hint that accessibility is being measured. Any change to this file after
a build has started must be recorded in the study log and applied to both arms.

## Product

A single screen: the Orders admin for a small ecommerce back office. One HTML
page, no routing, no server. Static seeded data is fine and expected.

## Required regions

**Page header.** Product name, a search field, and an account menu button.

**Sidebar.** Five destinations: Dashboard, Orders, Customers, Products,
Settings. Orders is the current one.

**Tabs.** Four views over the same table: All, Unfulfilled, Refunded, Archived.
Switching tabs filters the rows. All is the default.

**Filter bar.** A status dropdown, a date range control, a text filter, an
"apply" action and a "clear all" action. Show which filters are currently active
and let each be removed individually.

**Data table.** At least 12 rows and these columns: a row selection control,
Order number, Customer, Date, Status, Total, and a per row actions control.
Order number, Date and Total are sortable, and sorting is three state: ascending,
descending, and unsorted. Status is shown as a colored badge with five possible
values: Paid, Pending, Refunded, Failed, Archived.

**Bulk actions.** A control in the table header selects and deselects every row.
When one or more rows are selected, show a bar reporting how many are selected
and offering Archive and Export.

**Pagination.** Below the table. Page size selector, current page indicator,
previous and next, and a count of total results.

**Confirm dialog.** Archiving from the bulk actions bar opens a modal asking the
user to confirm. It has a title, body copy stating how many orders are affected,
a cancel action and a confirm action.

**Notification.** After a confirmed archive, show a transient success message.
Also provide a way to trigger an error message, since both need to exist.

**Settings panel.** Reachable from the account menu. It contains three on and
off switches, a numeric quantity control, a single slider, and a form with a
name field, an email field and a notes field. The form validates on submit: the
name is required, and the email must look like an email. Show what went wrong.

**Tooltips.** The per row actions control and at least two other controls carry
a short explanatory tooltip.

## Technical constraints

- One self contained `index.html`. Inline CSS and JavaScript are fine. No build
  step, no framework, no package installs, no external network requests.
- Must render correctly in current Chromium at a 1280 by 900 viewport.
- All interactions listed above must actually work. A control that looks right
  but does nothing is an incomplete build.
- Use the supplied design system for all visual decisions: color values, type
  scale, spacing, radius, component geometry and component states. Do not
  substitute your own visual design language. Where the design system provides a
  value, use it rather than inventing one.
- Where the design system does not specify something, make a reasonable choice
  consistent with the rest of it.

## Deliverable

`index.html` in the directory you are told to write to, plus a short `NOTES.md`
listing any decision where you departed from the design system and why.
