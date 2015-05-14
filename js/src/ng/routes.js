define([], function()
{
    return {
        defaultRoutePath: '/login',
        routes: {
            '/': {
                templateUrl: '/views/front-end/home.html',
                dependencies: [
                    'controllers/front-end/homeCtrll'
                ]
            },
            '/pages/:slug': {
                templateUrl: '/views/front-end/page-list.html',
                dependencies: [
                    'controllers/front-end/pageListCtrll'
                ]
            },
            '/:slug': {
                templateUrl: '/views/front-end/page-template.html',
                dependencies: [
                    'controllers/front-end/pageCtrll'
                ]
            }
        }
    };
});