/*
All rangefinders are a single box : it shoots a ray out at its <0, 0, 1> direction
    run shoots a ray and sets its value to the distance
*/

const G = require('tenshi/simulator/window_imports').globals;
const { rotateV3ByQuat, distance } = require('tenshi/simulator/Ammo/mathSupplements');

function Rangefinder(simulator, width, length, height, mass, iniX, iniY, iniZ)
{
    this.simulator = simulator;
    this.physicsObject = simulator.createBox(width, length, height, mass, 0x000000, iniX, iniY, iniZ);
}

Rangefinder.prototype.getVal = function()
{
    return this.value;
};

Rangefinder.prototype.run = function()
{
    var tr = new G.Ammo.btTransform();
    this.physicsObject.getMotionState().getWorldTransform(tr);

    var pos = tr.getOrigin();
    var rot = tr.getRotation();
    var upQ = new G.Ammo.btQuaternion(0, 0, 1, 0);

    var nPos = rotateV3ByQuat(upQ, rot);

    // raytracer raytraces start-point to end-point, so 1000 creates a distance raycast of magnitude 1000
    nPos = new G.Ammo.btVector3(pos.x() + 1000*nPos.x(), pos.y() + 1000*nPos.y(), pos.z() + 1000*nPos.z());

    this.raycast = new G.Ammo.ClosestRayResultCallback(pos, nPos);

    this.simulator.physicsWorld.rayTest(pos, nPos, this.raycast);
    if(this.raycast.hasHit)
    {
        var end = this.raycast.get_m_hitPointWorld();

        this.value = distance(pos, end);
    }
};

exports.Rangefinder = Rangefinder;
