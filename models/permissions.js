const json = require("../rolesAndPermission.json");

class Permissions {
  constructor() {
    json.roles.permission= [];
  }

  getPermissionsByRoleName(roleName) {
    const role = json.roles.find((r) => r.name == roleName);
    return role ? role.permission : [];
  }

  getControllerByRoleName(roleName){
    const role = json.roles.find((r) => r.name == roleName);
    return role ? role.controller : [];
  }
}

module.exports = Permissions;
