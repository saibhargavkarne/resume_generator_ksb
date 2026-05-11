// Keyed by state abbreviation (lowercase) → address for that state
const BY_ABBR = {
  'al': '3182 Cloverdale Rd, Montgomery, AL 36106',
  'ak': '3304 Pioneer Ave, Juneau, AK 99801',
  'az': '3007 W Rancho Dr, Phoenix, AZ 85017',
  'ar': '4718 Kavanaugh Blvd, Little Rock, AR 72207',
  'ca': '5201 H St, Sacramento, CA 95819',
  'co': '3407 Ash St, Denver, CO 80207',
  'ct': '52 Outlook Ave, Hartford, CT 06106',
  'de': '128 Pear Tree Run, Dover, DE 19904',
  'fl': '2611 Killearn Center Blvd, Tallahassee, FL 32309',
  'ga': '617 Brookhaven Way NE, Atlanta, GA 30319',
  'hi': '2748 Manoa Rd, Honolulu, HI 96822',
  'id': '3311 Meander Way, Boise, ID 83705',
  'il': '1847 Chatham Rd, Springfield, IL 62704',
  'in': '5312 Winthrop Ave, Indianapolis, IN 46220',
  'ia': '4109 Ingersoll Ave, Des Moines, IA 50312',
  'ks': '2934 SW MacVicar Ave, Topeka, KS 66611',
  'ky': '418 Westover Ave, Frankfort, KY 40601',
  'la': '3705 Kleinert Ave, Baton Rouge, LA 70806',
  'me': '37 Cony St, Augusta, ME 04330',
  'md': '824 Sherwood Forest Dr, Annapolis, MD 21401',
  'ma': '42 Pinckney St, Boston, MA 02114',
  'mi': '2508 Sheridan Rd, Lansing, MI 48910',
  'mn': '1635 Fairmount Ave, St. Paul, MN 55105',
  'ms': '3214 Ridgewood Rd, Jackson, MS 39211',
  'mo': '512 Moreau Dr, Jefferson City, MO 65109',
  'mt': '924 Benton Ave, Helena, MT 59601',
  'ne': '5631 Vine St, Lincoln, NE 68505',
  'nv': '1408 Snyder Ave, Carson City, NV 89703',
  'nh': '29 Rumford St, Concord, NH 03301',
  'nj': '814 Stuyvesant Ave, Trenton, NJ 08618',
  'nm': '728 Acequia Madre, Santa Fe, NM 87505',
  'ny': '214 Whitehall Rd, Albany, NY 12209',
  'nc': '3609 Granville Dr, Raleigh, NC 27609',
  'nd': '1724 Woodridge Dr, Bismarck, ND 58503',
  'oh': '2915 Bryden Rd, Columbus, OH 43209',
  'ok': '3821 NW 58th Terr, Oklahoma City, OK 73112',
  'or': '4307 Kuebler Blvd S, Salem, OR 97302',
  'pa': '319 Hummel Ave, Harrisburg, PA 17104',
  'ri': '47 Elmgrove Ave, Providence, RI 02906',
  'sc': '3118 Trenholm Rd, Columbia, SC 29204',
  'sd': '614 Poplar Ave, Pierre, SD 57501',
  'tn': '1427 Linden Ave, Nashville, TN 37212',
  'tx': '2209 Enfield Rd, Austin, TX 78703',
  'ut': '1743 Harvard Ave, Salt Lake City, UT 84105',
  'vt': '23 Terrace St, Montpelier, VT 05602',
  'va': '4307 Hanover Ave, Richmond, VA 23221',
  'wa': '2814 Eastside St NE, Olympia, WA 98506',
  'wv': '1132 Quarrier St, Charleston, WV 25301',
  'wi': '3027 Nakoma Rd, Madison, WI 53711',
  'wy': '918 E 16th St, Cheyenne, WY 82001',
}

// Keyed by full state name (lowercase) → same addresses
const BY_NAME = {
  'alabama': BY_ABBR['al'], 'alaska': BY_ABBR['ak'], 'arizona': BY_ABBR['az'],
  'arkansas': BY_ABBR['ar'], 'california': BY_ABBR['ca'], 'colorado': BY_ABBR['co'],
  'connecticut': BY_ABBR['ct'], 'delaware': BY_ABBR['de'], 'florida': BY_ABBR['fl'],
  'georgia': BY_ABBR['ga'], 'hawaii': BY_ABBR['hi'], 'idaho': BY_ABBR['id'],
  'illinois': BY_ABBR['il'], 'indiana': BY_ABBR['in'], 'iowa': BY_ABBR['ia'],
  'kansas': BY_ABBR['ks'], 'kentucky': BY_ABBR['ky'], 'louisiana': BY_ABBR['la'],
  'maine': BY_ABBR['me'], 'maryland': BY_ABBR['md'], 'massachusetts': BY_ABBR['ma'],
  'michigan': BY_ABBR['mi'], 'minnesota': BY_ABBR['mn'], 'mississippi': BY_ABBR['ms'],
  'missouri': BY_ABBR['mo'], 'montana': BY_ABBR['mt'], 'nebraska': BY_ABBR['ne'],
  'nevada': BY_ABBR['nv'], 'new hampshire': BY_ABBR['nh'], 'new jersey': BY_ABBR['nj'],
  'new mexico': BY_ABBR['nm'], 'new york': BY_ABBR['ny'], 'north carolina': BY_ABBR['nc'],
  'north dakota': BY_ABBR['nd'], 'ohio': BY_ABBR['oh'], 'oklahoma': BY_ABBR['ok'],
  'oregon': BY_ABBR['or'], 'pennsylvania': BY_ABBR['pa'], 'rhode island': BY_ABBR['ri'],
  'south carolina': BY_ABBR['sc'], 'south dakota': BY_ABBR['sd'], 'tennessee': BY_ABBR['tn'],
  'texas': BY_ABBR['tx'], 'utah': BY_ABBR['ut'], 'vermont': BY_ABBR['vt'],
  'virginia': BY_ABBR['va'], 'washington': BY_ABBR['wa'], 'west virginia': BY_ABBR['wv'],
  'wisconsin': BY_ABBR['wi'], 'wyoming': BY_ABBR['wy'],
}

// Keep for backward compat (capital city name → address)
export const STATE_CAPITAL_ADDRESSES = {
  'montgomery': BY_ABBR['al'], 'juneau': BY_ABBR['ak'], 'phoenix': BY_ABBR['az'],
  'little rock': BY_ABBR['ar'], 'sacramento': BY_ABBR['ca'], 'denver': BY_ABBR['co'],
  'hartford': BY_ABBR['ct'], 'dover': BY_ABBR['de'], 'tallahassee': BY_ABBR['fl'],
  'atlanta': BY_ABBR['ga'], 'honolulu': BY_ABBR['hi'], 'boise': BY_ABBR['id'],
  'springfield': BY_ABBR['il'], 'indianapolis': BY_ABBR['in'], 'des moines': BY_ABBR['ia'],
  'topeka': BY_ABBR['ks'], 'frankfort': BY_ABBR['ky'], 'baton rouge': BY_ABBR['la'],
  'augusta': BY_ABBR['me'], 'annapolis': BY_ABBR['md'], 'boston': BY_ABBR['ma'],
  'lansing': BY_ABBR['mi'], 'st. paul': BY_ABBR['mn'], 'saint paul': BY_ABBR['mn'],
  'jackson': BY_ABBR['ms'], 'jefferson city': BY_ABBR['mo'], 'helena': BY_ABBR['mt'],
  'lincoln': BY_ABBR['ne'], 'carson city': BY_ABBR['nv'], 'concord': BY_ABBR['nh'],
  'trenton': BY_ABBR['nj'], 'santa fe': BY_ABBR['nm'], 'albany': BY_ABBR['ny'],
  'raleigh': BY_ABBR['nc'], 'bismarck': BY_ABBR['nd'], 'columbus': BY_ABBR['oh'],
  'oklahoma city': BY_ABBR['ok'], 'salem': BY_ABBR['or'], 'harrisburg': BY_ABBR['pa'],
  'providence': BY_ABBR['ri'], 'columbia': BY_ABBR['sc'], 'pierre': BY_ABBR['sd'],
  'nashville': BY_ABBR['tn'], 'austin': BY_ABBR['tx'], 'salt lake city': BY_ABBR['ut'],
  'montpelier': BY_ABBR['vt'], 'richmond': BY_ABBR['va'], 'olympia': BY_ABBR['wa'],
  'charleston': BY_ABBR['wv'], 'madison': BY_ABBR['wi'], 'cheyenne': BY_ABBR['wy'],
}

/**
 * Resolves a full residential address from any US location string.
 * Matches by state abbreviation, state name, or capital city name.
 * Works for: "Texas", "TX", "Dallas, TX", "Chicago, IL", "Wyoming", etc.
 * Returns null if no US state can be identified.
 */
export function getAddressForCity(locationStr) {
  if (!locationStr) return null
  const parts = locationStr.split(',').map((p) => p.trim().toLowerCase())

  for (const part of parts) {
    // State abbreviation (e.g. "tx", "il")
    if (BY_ABBR[part]) return BY_ABBR[part]
    // State name (e.g. "texas", "illinois")
    if (BY_NAME[part]) return BY_NAME[part]
    // Capital city name (e.g. "austin", "springfield")
    if (STATE_CAPITAL_ADDRESSES[part]) return STATE_CAPITAL_ADDRESSES[part]
  }

  // Multi-word state name split across parts (e.g. "new" + "york")
  const full = parts.join(' ')
  if (BY_NAME[full]) return BY_NAME[full]

  return null
}
