const Role = require("../models/role.model.js");

const searchAndFilterRole = async (req, res) => {
  try {
    const search=req.query.search|| "";
    const roles=await Role.find({roleName:{$regex:search,$options:"i"}});
    const response = roles.map((value) => {
      return {
        id: value._id,
        roleName: value.roleName,
        roleDescription: value.roleDescription,
        userIds: value.userIds,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const search=req.query.search|| "";
    const roles=await Role.find({roleName:{$regex:search,$options:"i"}}).populate("userIds");
    const response = roles.map((value) => {
      return {
        id: value._id,
        roleName: value.roleName,
        roleDescription: value.roleDescription,
        userIds: value.userIds,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id).populate("userIds");

    res.status(200).json({
      id: role._id,
      roleName: role.roleName,
      roleDescription: role.roleDescription,
      userIds: role.userIds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const existRole = await Role.findOne({ roleName: req.body.roleName });
    if (existRole != null) {
      return res.status(500).json({
        message: "Role is already exist, please insert new role !",
      });
    } else {
      const role = await Role.create(req.body);
      res.status(200).json({
        id: role._id,
        roleName: role.roleName,
        roleDescription: role.roleDescription,
        userIds: role.userIds,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndUpdate(id, req.body);

    if (!role) {
      return res.status(404).json({ message: "Role is not Found !" });
    }

    const updatedRole = await Role.findById(id);
    res.status(200).json({
      id: updatedRole._id,
      roleName: updatedRole.roleName,
      roleDescription: updatedRole.roleDescription,
      userIds: updatedRole.userIds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({ message: "Role is not Found !" });
    }

    res.status(200).json({ message: "Role Deleted Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  searchAndFilterRole,
};
