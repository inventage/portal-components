export const data = {
  groups: {
    group1: [
      {
        id: 'menu1',
        labels: {
          de: 'Menu1_de',
          en: 'Menu1_en',
        },
        link: '/some/path/menu1',
      },
      {
        id: 'menu2',
        defaultItem: 'item.2.2',
        labels: {
          de: 'Menu2_de',
          en: 'Menu2_en',
        },
        items: [
          {
            id: 'item2.1',
            labels: {
              de: 'Item 2.1_de',
              en: 'Item 2.1_en',
            },
            link: '/some/path/item2.1',
          },
          {
            id: 'item2.2',
            labels: {
              de: 'Item 2.2_de',
              en: 'Item 2.2_en',
            },
            link: '/some/path/item2.2',
          },
        ],
      },
    ],
  },
};
