const toTree = function (rows) {
  function exists(rows, ParentModuleId) {
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].ModuleId == ParentModuleId) return true;
    }
    return false;
  }

  var nodes = [];
  // 得到顶层节点  
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (!exists(rows, row.ParentModuleId)) {
      nodes.push({
        ModuleId: '' + row.ModuleId,
        ModuleName: row.ModuleName,
        ModuleUri: row.ModuleUri,
        ParentModuleId: '' + row.ParentModuleId,
        DisplayOrder: row.DisplayOrder,
        Deleted: row.Deleted
      });
    }
  }

  var toDo = [];
  for (var i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i]);
  }
  while (toDo.length) {
    var node = toDo.shift();    // 父节点   
    // 得到子节点   
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.ParentModuleId == node.ModuleId) {
        var child = {
          ModuleId: '' + row.ModuleId, ModuleName: row.ModuleName,
          ModuleUri: row.ModuleUri, ParentModuleId: '' + row.ParentModuleId,
          DisplayOrder: row.DisplayOrder, Deleted: row.Deleted
        };
        if (node.children) {
          node.children.push(child);
        } else {
          node.children = [child];
        }
        toDo.push(child);
      }
    }
  }
  return nodes;
}
export { toTree }