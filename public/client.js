'use strict';
var auth;
var keycloakAuth = new Keycloak('keycloak.json');

function callCloud(route) {
  keycloakAuth.updateToken(30)
    .success(function() {
      if(keycloakAuth && keycloakAuth.token) {
        auth.token = keycloakAuth.token;
        $fh.cloud(
            {
              path: 'keycloak-demo/' + route,
              method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + auth.token
              },
              timeout: 25000
            },
            function (res) {
              document.getElementById('cloudResponse').innerHTML = '<p>' + res.msg + '</p>';
            },
            function (code, errorprops, params) {
              document.getElementById('cloudResponse').innerHTML = '<p class="auth_error">' + code + '</p>';
            }
        );
      }
    })
    .error(function() {
        document.getElementById('cloudResponse').innerHTML = '<p class="auth_error">Error updating token.</p>';
    });


}

function onLoad() {
  keycloakAuth.init({
    onLoad: 'login-required'
  })
  .success(function() {
    if(keycloakAuth.authenticated) {
      auth = keycloakAuth;
      console.log('Token:' + JSON.stringify(auth, null, 4));
    }
    else {
      alert('Not authenticated');
    }
  })
  .error(function() {
    alert('Error in auth init');
  });
}

document.getElementById('noAuthentication').onclick = function () {
  callCloud('no-authentication-needed');
};

document.getElementById('authentication').onclick = function () {
  callCloud('needs-authentication');
};

document.getElementById('userRole').onclick = function () {
  callCloud('needs-user-role');
};

document.getElementById('supervisorRole').onclick = function () {
  callCloud('needs-supervisor-role');
};

document.getElementById('adminRole').onclick = function () {
  callCloud('needs-admin-role');
};

document.getElementById('logout').onclick = function () {
  keycloakAuth.logout();
  document.window.location.reload();
};
