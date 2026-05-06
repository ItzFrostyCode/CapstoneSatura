Your subscription plans map like this
Basic Plan

This is the smallest usable shop version:

create/view customer profiles
manual job order tracking
physical receipt printing
manual digital appointment calendar
daily sales summary
simple admin dashboard
Pro Plan

This adds operational automation:

inventory and supplier management
automated email/SMS notifications
digital invoice generation
automated appointment reminders
detailed inventory and financial reports
role-based access control
Premium Plan

This is your full ERP-style shop:

create/view posted products
customized shop profile
multi-branch support
multi-branch analytics
administrative audit logs






Clean rule set

Shop Owner

register and subscribe
create main shop
create branch
assign branch manager
overall control and reports

Shop Manager

manage one assigned branch
add branch staff
handle branch-level orders, inventory, and scheduling
no control over other branches or subscription

Staff

do production/workflow tasks only
Best way to write it in thesis logic

You can say:

“User management is handled by the Shop Owner at the main shop level, while branch-level staff management is delegated to the Shop Manager assigned to each branch.”

That keeps the system realistic and scalable for a tailoring business with multiple locations.

For your ERD / access logic

You should encode it like this:

shops.owner_user_id → Shop Owner
shop_branches.manager_user_id → Shop Manager
branch_members → staff under that branch
branch_permissions → access per branch role

So yes, the flow is:
Owner → create branch → assign manager → manager adds staff.
That is the cleanest version for your thesis.