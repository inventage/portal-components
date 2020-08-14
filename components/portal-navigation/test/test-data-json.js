export const data = {
  groups: {
    group1: {
      menus: [
        {
          id: 'menu1',
          label: {
            de: 'Menu1_de',
            en: 'Menu1_en',
          },
          url: '/some/path/menu1',
          application: 'app1',
        },
        {
          id: 'menu2',
          defaultItem: 'item2.2',
          label: {
            de: 'Menu2_de',
            en: 'Menu2_en',
          },
          items: [
            {
              id: 'item2.1',
              label: {
                de: 'Item 2.1_de',
                en: 'Item 2.1_en',
              },
              url: '/some/path/item2.1',
              application: 'app1',
            },
            {
              id: 'item2.2',
              label: {
                de: 'Item 2.2_de',
                en: 'Item 2.2_en',
              },
              url: '/some/path/item2.2',
              application: 'app1',
            },
          ],
        },
      ],
    },
    group2: {
      dropdown: true,
      icon: '/some/icon/url',
      label: {
        en: 'Group2_en',
        de: 'Group2_de',
      },
      menus: [
        {
          id: 'menu3',
          label: {
            de: 'Menu3_de',
            en: 'Menu3_en',
          },
          url: '/some/path/menu3',
          items: [
            {
              id: 'item3.1',
              label: {
                de: 'Item 3.1_de',
                en: 'Item 3.1_en',
              },
              url: '/some/path/item3.1',
              application: 'app2',
            },
            {
              id: 'item3.2',
              label: {
                de: 'Item 3.2_de',
                en: 'Item 3.2_en',
              },
              url: '/some/path/item3.2',
              internalRouting: false,
            },
            {
              label: {
                de: 'Item generatedId_de',
                en: 'Item generatedId_en',
              },
              url: '/some/path/generatedId',
            },
          ],
        },
        {
          id: 'menu4',
          label: {
            de: 'Menu4_de',
            en: 'Menu4_en',
          },
          url: '/some/path/menu4',
        },
      ],
    },
  },
};
