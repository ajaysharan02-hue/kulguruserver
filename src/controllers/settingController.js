const GeneralSetting = require('../models/GeneralSetting');
const asyncHandler = require('../middleware/asyncHandler');

// Derive allowed keys from schema (model-driven, no hardcoded constants)
function getAllowedSettingKeys() {
    const excluded = new Set(['_id', '__v', 'updatedBy', 'createdAt', 'updatedAt']);
    return Object.keys(GeneralSetting.schema.paths).filter((k) => !excluded.has(k));
}

// Migrate legacy document that had `settings` Mixed into fixed fields
async function migrateIfLegacy(doc) {
    if (!doc) return null;
    // @ts-ignore tolerate legacy shape
    const legacy = doc.settings && typeof doc.settings === 'object' ? doc.settings : null;
    if (!legacy) return doc;

    const allowed = new Set(getAllowedSettingKeys());
    for (const [k, v] of Object.entries(legacy)) {
        if (allowed.has(k) && (doc[k] === undefined || doc[k] === null || doc[k] === '')) {
            doc[k] = v;
        }
    }
    // Remove legacy bag
    // @ts-ignore
    doc.settings = undefined;
    await doc.save();
    return doc;
}

/**
 * Get general settings (single document)
 */
exports.getSettings = asyncHandler(async (req, res, next) => {
    let doc = await GeneralSetting.findOne();
    
    res.status(200).json({ success: true, data: doc });
});

/**
 * Update general settings – only schema-defined keys are accepted.
 */
exports.updateSettings = asyncHandler(async (req, res, next) => {
    const { settings } = req.body;
    const incoming = settings && typeof settings === 'object' ? settings : {};

    let doc = await GeneralSetting.findOne();
    if (!doc) {
        doc = await GeneralSetting.create({});
    } else {
        doc = await migrateIfLegacy(doc);
    }

    const keys = getAllowedSettingKeys();
    for (const k of keys) {
        if (Object.prototype.hasOwnProperty.call(incoming, k)) {
            let v = incoming[k];
            // light coercion based on schema type
            const path = GeneralSetting.schema.paths[k];
            if (path && path.instance === 'Boolean' && typeof v === 'string') {
                const s = v.toLowerCase().trim();
                v = s === 'true' || s === '1' || s === 'yes';
            }
            if (path && path.instance === 'Number' && typeof v !== 'number') {
                const n = Number(v);
                v = Number.isFinite(n) ? n : doc[k];
            }
            doc[k] = v;
        }
    }
    doc.updatedBy = req.user?._id || doc.updatedBy;
    await doc.save();

    const data = {};
    for (const k of keys) data[k] = doc[k];
    res.status(200).json({ success: true, data });
});
