export const STATE_CAPITAL_ADDRESSES = {
  'montgomery': '3182 Cloverdale Rd, Montgomery, AL 36106',
  'juneau': '3304 Pioneer Ave, Juneau, AK 99801',
  'phoenix': '3007 W Rancho Dr, Phoenix, AZ 85017',
  'little rock': '4718 Kavanaugh Blvd, Little Rock, AR 72207',
  'sacramento': '5201 H St, Sacramento, CA 95819',
  'denver': '3407 Ash St, Denver, CO 80207',
  'hartford': '52 Outlook Ave, Hartford, CT 06106',
  'dover': '128 Pear Tree Run, Dover, DE 19904',
  'tallahassee': '2611 Killearn Center Blvd, Tallahassee, FL 32309',
  'atlanta': '617 Brookhaven Way NE, Atlanta, GA 30319',
  'honolulu': '2748 Manoa Rd, Honolulu, HI 96822',
  'boise': '3311 Meander Way, Boise, ID 83705',
  'springfield': '1847 Chatham Rd, Springfield, IL 62704',
  'indianapolis': '5312 Winthrop Ave, Indianapolis, IN 46220',
  'des moines': '4109 Ingersoll Ave, Des Moines, IA 50312',
  'topeka': '2934 SW MacVicar Ave, Topeka, KS 66611',
  'frankfort': '418 Westover Ave, Frankfort, KY 40601',
  'baton rouge': '3705 Kleinert Ave, Baton Rouge, LA 70806',
  'augusta': '37 Cony St, Augusta, ME 04330',
  'annapolis': '824 Sherwood Forest Dr, Annapolis, MD 21401',
  'boston': '42 Pinckney St, Boston, MA 02114',
  'lansing': '2508 Sheridan Rd, Lansing, MI 48910',
  'st. paul': '1635 Fairmount Ave, St. Paul, MN 55105',
  'saint paul': '1635 Fairmount Ave, St. Paul, MN 55105',
  'jackson': '3214 Ridgewood Rd, Jackson, MS 39211',
  'jefferson city': '512 Moreau Dr, Jefferson City, MO 65109',
  'helena': '924 Benton Ave, Helena, MT 59601',
  'lincoln': '5631 Vine St, Lincoln, NE 68505',
  'carson city': '1408 Snyder Ave, Carson City, NV 89703',
  'concord': '29 Rumford St, Concord, NH 03301',
  'trenton': '814 Stuyvesant Ave, Trenton, NJ 08618',
  'santa fe': '728 Acequia Madre, Santa Fe, NM 87505',
  'albany': '214 Whitehall Rd, Albany, NY 12209',
  'raleigh': '3609 Granville Dr, Raleigh, NC 27609',
  'bismarck': '1724 Woodridge Dr, Bismarck, ND 58503',
  'columbus': '2915 Bryden Rd, Columbus, OH 43209',
  'oklahoma city': '3821 NW 58th Terr, Oklahoma City, OK 73112',
  'salem': '4307 Kuebler Blvd S, Salem, OR 97302',
  'harrisburg': '319 Hummel Ave, Harrisburg, PA 17104',
  'providence': '47 Elmgrove Ave, Providence, RI 02906',
  'columbia': '3118 Trenholm Rd, Columbia, SC 29204',
  'pierre': '614 Poplar Ave, Pierre, SD 57501',
  'nashville': '1427 Linden Ave, Nashville, TN 37212',
  'austin': '2209 Enfield Rd, Austin, TX 78703',
  'salt lake city': '1743 Harvard Ave, Salt Lake City, UT 84105',
  'montpelier': '23 Terrace St, Montpelier, VT 05602',
  'richmond': '4307 Hanover Ave, Richmond, VA 23221',
  'olympia': '2814 Eastside St NE, Olympia, WA 98506',
  'charleston': '1132 Quarrier St, Charleston, WV 25301',
  'madison': '3027 Nakoma Rd, Madison, WI 53711',
  'cheyenne': '918 E 16th St, Cheyenne, WY 82001',
}

/**
 * Returns the full residential address for a US state capital city.
 * Accepts "City" or "City, ST" format.
 */
export function getAddressForCity(cityStr) {
  if (!cityStr) return null
  const city = cityStr.split(',')[0].trim().toLowerCase()
  return STATE_CAPITAL_ADDRESSES[city] || null
}
