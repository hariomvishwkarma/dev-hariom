# TS3 Edge pre-order — order confirmation email

Theme code adds a line item property when a ts3-edge product is purchased in pre-order mode. Use the steps below so the order confirmation email shows the pre-order message only for qualifying orders.

## Line item property (automatic)

When pre-order conditions are met, the product form submits:

- **Property name:** `Pre-order`
- **Property value:** `Wordt verzonden vanaf 11 juni`

These appear on the order in Shopify Admin and can be rendered in notification templates.

## Shopify Admin: Order confirmation template

1. Go to **Settings → Notifications → Order confirmation**.
2. In the line items loop, add a check for the pre-order property.

Example (adjust to match your existing email HTML):

```liquid
{% for line in line_items %}
  ...
  {% for property in line.properties %}
    {% if property.first == 'Pre-order' %}
      <p><strong>Pre-order: {{ property.last }}</strong></p>
    {% endif %}
  {% endfor %}
{% endfor %}
```

For a single order-level notice when any line is a pre-order:

```liquid
{% assign has_ts3_pre_order = false %}

{% for line in line_items %}
  {% for property in line.properties %}
    {% if property.first == 'Pre-order' %}
      {% assign has_ts3_pre_order = true %}
      {% break %}
    {% endif %}
  {% endfor %}
{% endfor %}

{% if has_ts3_pre_order %}
  <p><strong>Pre-order: Wordt verzonden vanaf 11 juni</strong></p>
{% endif %}
```

## Notes

- Email templates live in **Shopify Admin**, not in the theme repository.
- The property is only added when inventory is 0 or below and **Continue selling when out of stock** is enabled on the variant.
- Products on other templates are not affected.
