export const data = {
  groups: {
    group1: {
      menus: [
        {
          id: 'menu1',
          labels: {
            de: 'Menu1_de',
            en: 'Menu1_en',
          },
          link: '/some/path/menu1',
          internalRouting: true,
          application: 'app1',
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
    group2: {
      dropdown: true,
      icon: '/some/icon/url',
      labels: {
        en: 'Group2_en',
        de: 'Group2_de',
      },
      menus: [
        {
          id: 'menu3',
          labels: {
            de: 'Menu3_de',
            en: 'Menu3_en',
          },
          link: '/some/path/menu3',
          items: [
            {
              id: 'item3.1',
              labels: {
                de: 'Item 3.1_de',
                en: 'Item 3.1_en',
              },
              link: '/some/path/item3.1',
            },
            {
              id: 'item3.2',
              labels: {
                de: 'Item 3.2_de',
                en: 'Item 3.2_en',
              },
              link: '/some/path/item3.2',
            },
            {
              labels: {
                de: 'Item generatedId_de',
                en: 'Item generatedId_en',
              },
              link: '/some/path/generatedId',
            },
          ],
        },
        {
          id: 'menu4',
          labels: {
            de: 'Menu4_de',
            en: 'Menu4_en',
          },
          link: '/some/path/menu4',
        },
      ],
    },
  },
};