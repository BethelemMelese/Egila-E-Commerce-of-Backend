const permissions = require("../rolesAndPermission.json");

class Permissions {
  constructor() {
    permissions.roles.permission= [];
  }

  getPermissionsByRoleName(roleName) {
    const role = permissions.roles.find((r) => r.name == roleName);
    return role ? role.permission : [];
  }
}

module.exports = Permissions;
