export const PAGES_MENU = [
	{
		path: 'pages',
		children: [
			{
				path: 'clients',
				data: {
					menu: {
						title: 'Clients',
						icon: 'fa fa-caret-right',
						selected: false,
						expanded: false,
						order: 0
					}
				}
			},
			{
				path: 'account',  // path for our page
				data: { // custom menu declaration
					menu: {
						title: 'Account', // menu title
						icon: 'fa fa-caret-right', // menu icon
						pathMatch: 'prefix', // use it if item children not displayed in menu
						selected: false,
						expanded: false,
						order: 0
					}
				}
      },
		]
  },
  {
    path: 'introduction',  // path for our page
    data: { // custom menu declaration
      menu: {
        title: 'Training', // menu title
        icon: 'fa fa-caret-right', // menu icon
        //pathMatch: 'prefix', // use it if item children not displayed in menu
        selected: false,
        expanded: false,
        order: 0
      }
    }
  },
  {
	path: 'pages',
	children: [
		{
			path: 'support',
			data: {
				menu: {
					title: 'Support',
					icon: 'fa fa-caret-right',
					selected: false,
					expanded: false,
					order: 0
				}
			}
		}
	]
}
];
