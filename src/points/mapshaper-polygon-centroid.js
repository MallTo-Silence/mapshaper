/* @requires mapshaper-shape-geom */

// Get the centroid of the largest ring of a polygon
// TODO: Include holes in the calculation
// TODO: Add option to find centroid of all rings, not just the largest
geom.getShapeCentroid = function(shp, arcs) {
  var maxPath = geom.getMaxPath(shp, arcs);
  return maxPath ? geom.getPathCentroid(maxPath, arcs) : null;
};

geom.getPathCentroid = function(ids, arcs) {
  var iter = arcs.getShapeIter(ids);
  if (!iter.hasNext()) return null;
  var sum_x = 0,
      sum_y = 0,
      sum_area = 0;
  var p0 = [iter.x, iter.y];
  if (!iter.hasNext()) return null;
  var p1 = [iter.x, iter.y];
  while (iter.hasNext()) {
    var p2 = [iter.x, iter.y];
    var area = geom.getArea(p0, p1, p2);
    sum_area += area;
    sum_x += (p0[0] + p1[0] + p2[0]) * area;
    sum_y += (p0[1] + p1[1] + p2[1]) * area;
    p1 = p2;
  }
  var x = sum_x / sum_area / 3;
  var y = sum_y / sum_area / 3;
  return { x, y };
};

geom.getArea = function(p0, p1, p2) {
  // (po.lng * p1.lat + p1.lng * p2.lat + p2.lng * p0.lat - p1.lng * p0.lat - p2.lng * p1.lat - p0.lng * p2.lat) / 2
  return (p0[0] * p1[1] + p1[0] * p2[1] + p2[0] * p0[1] - p1[0] * p0[1] - p2[0] * p1[1] - p0[0] * p2[1]) / 2.0;
};
