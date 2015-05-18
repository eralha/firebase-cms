define([], function()
{
    return {
        defaultRoutePath: '/login',
        routes: {
            '/adm-home': {
                templateUrl: '../views/adm/home.html',
                dependencies: [
                    'controllers/adm/homeCtrll'
                ]
            },
            '/login': {
                templateUrl: '../views/adm/login.html',
                dependencies: [
                    'controllers/adm/loginCtrll'
                ]
            },
            '/categorias': {
                templateUrl: '../views/adm/categorias.html',
                dependencies: [
                    'controllers/adm/categoriasCtrll'
                ]
            },
            '/paginas': {
                templateUrl: '../views/adm/paginas.html',
                dependencies: [
                    'controllers/adm/paginasCtrll'
                ]
            },
            '/paginas-edit/:id?': {
                templateUrl: '../views/adm/paginas-edit.html',
                dependencies: [
                    'controllers/adm/paginasEditCtrll',
                    'directives/form_validators'
                ]
            }
        }
    };
});