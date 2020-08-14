# Configuration

The structure and behavior of a portal navigation is defined by its configuration. The configuration must
adhere to the following structure.

## Structure

```json
{
  "groups": {
    "main": {
      "menus": [
        {
          "label": "Home",
          "url": "/url/to/home"
        },
        {
          "label": "Projects",
          "items": [
            {
              "labels": "Project 1",
              "url": "/url/to/project1"
            },
            {
              "id": "project2",
              "label": "Project 2",
              "url": "/url/to/project2"
            }
          ]
        }
      ]
    },
    "meta": {},
    "profile": {},
    "logout": {}
  }
}
```

## Group

| Attribute    | Type                                  | Mandatory | Default |
| ------------ | ------------------------------------- | --------- | ------- |
| menus        | `Array<Menu>`                         | x         |         |
| dropdown (1) | `boolean`                             |           | false   |
| label (1)    | `String` or `Array<ISO-Code, String>` |           |         |
| icon (1)     | `String`                              |           |         |

(1) If dropdown is true a label and/or icon is necessary.

## Menu

| Attribute   | Type          | Mandatory | Default |
| ----------- | ------------- | --------- | ------- |
| items       | `Array<Item>` | x         |         |
| defaultItem | `String`      |           |         |

## Menu & Item

| Attribute                   | Type                                  | Mandatory | Default |
| --------------------------- | ------------------------------------- | --------- | ------- |
| id                          | `String`                              | (1)       |         |
| url                         | `String`                              | (2)       |         |
| icon                        | `String`                              | (3)       |         |
| label                       | `String` or `Array<ISO-Code, String>` | (3)       |         |
| internalRouting             | `boolean`                             |           | false   |
| internalRoutingApplications | `Array<String>`                       |           |         |
| destination                 | `String`                              |           |         |
| application                 | `String`                              |           |         |

(1) If you need to identify an item to be able to make it a defaultItem or assign badge values, you need an explicit id.

(2) If a menu only shows its child items and never needs any routing you might get away with having no url. Otherwise this can be considered mandatory.

(3) You need to provide a label and/or an icon.
