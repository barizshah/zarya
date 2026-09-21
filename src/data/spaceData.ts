export interface LaunchSite {
  id: string;
  name: string;
  country: string;
  flag: string;
  operator: string;
  location: string;
  coordinates: string;
  description: string;
  notablePads: string[];
}

export interface SpaceAgency {
  id: string;
  name: string;
  code: string;
  country: string;
  flag: string;
  founded: string;
  headquarters: string;
  roleInIss: string;
  primaryRockets: string[];
  description: string;
  iconName: string;
}

export interface LocationFact {
  region: string;
  title: string;
  fact: string;
  highlightMetric: string;
}

/**
 * Curated world orbital spaceports
 */
export const LAUNCH_SITES: LaunchSite[] = [
  {
    id: 'ksc-ccafs',
    name: 'Kennedy Space Center & Cape Canaveral',
    country: 'United States',
    flag: '🇺🇸',
    operator: 'NASA / US Space Force / SpaceX / ULA',
    location: 'Brevard County, Florida, USA',
    coordinates: '28.5721° N, 80.6480° W',
    description: "America's premier spaceport, launch site for Apollo moon missions, Space Shuttle fleet, and commercial crew flights to the ISS.",
    notablePads: ['LC-39A (SpaceX / Falcon Heavy)', 'SLC-40 (Falcon 9)', 'SLC-41 (Vulcan Centaur)'],
  },
  {
    id: 'vandenberg',
    name: 'Vandenberg Space Force Base',
    country: 'United States',
    flag: '🇺🇸',
    operator: 'US Space Force / SpaceX / Firefly',
    location: 'Santa Barbara County, California, USA',
    coordinates: '34.7420° N, 120.5724° W',
    description: "Primary US military and commercial polar-orbit launch site. Trajectories south over the Pacific allow insertion into sun-synchronous orbits.",
    notablePads: ['SLC-4E (SpaceX Falcon 9)', 'SLC-6', 'SLC-2W (Alpha)'],
  },
  {
    id: 'baikonur',
    name: 'Baikonur Cosmodrome',
    country: 'Kazakhstan (Leased by Russia)',
    flag: '🇰🇿',
    operator: 'Roscosmos',
    location: 'Kyzylorda Region, Kazakhstan',
    coordinates: '45.9650° N, 63.3050° E',
    description: "World's first and largest operational space launch facility. Launched Sputnik 1 (1957), Yuri Gagarin (1961), and the ISS Zarya core module (1998).",
    notablePads: ['Site 1/5 (Gagarin\'s Start)', 'Site 31/6 (Soyuz-2)', 'Site 200 (Proton-M)'],
  },
  {
    id: 'kourou',
    name: 'Guiana Space Centre (CSG Kourou)',
    country: 'French Guiana (France)',
    flag: '🇫🇷',
    operator: 'CNES / European Space Agency / Arianespace',
    location: 'Kourou, French Guiana',
    coordinates: '5.2322° N, 52.7606° W',
    description: "Europe's spaceport. Positioned just 5° north of the Equator, Earth's spin adds ~460 m/s eastward velocity, maximizing heavy payload capacity into GTO.",
    notablePads: ['ELA-4 (Ariane 6)', 'ELV (Vega-C)'],
  },
  {
    id: 'tanegashima',
    name: 'Tanegashima Space Center',
    country: 'Japan',
    flag: '🇯🇵',
    operator: 'JAXA',
    location: 'Kagoshima Prefecture, Japan',
    coordinates: '30.4000° N, 130.9700° E',
    description: "Scenic oceanfront launch facility in southern Japan. Handles launches of the H3 and H-IIA rockets, delivering HTV-X cargo ships to the ISS.",
    notablePads: ['Yoshinobu Launch Complex (H3 / H-IIA)'],
  },
  {
    id: 'sriharikota',
    name: 'Satish Dhawan Space Centre (SDSC SHAR)',
    country: 'India',
    flag: '🇮🇳',
    operator: 'ISRO',
    location: 'Sriharikota, Andhra Pradesh, India',
    coordinates: '13.7199° N, 80.2304° E',
    description: "India's orbital gateway on the Bay of Bengal coast. Home of Chandrayaan and Aditya-L1 launches and the upcoming Gaganyaan human spaceflight program.",
    notablePads: ['First Launch Pad (PSLV)', 'Second Launch Pad (LVM3 / GSLV)'],
  },
  {
    id: 'starbase',
    name: 'Starbase Boca Chica',
    country: 'United States',
    flag: '🇺🇸',
    operator: 'SpaceX',
    location: 'Brownsville, Cameron County, Texas, USA',
    coordinates: '25.9972° N, 97.1561° W',
    description: "Dedicated private production and orbital launch complex for the Starship Super Heavy launch system, the largest and most powerful rocket ever flown.",
    notablePads: ['Orbital Launch Mount 1', 'Suborbital Pad A & B'],
  },
  {
    id: 'mahia',
    name: 'Rocket Lab Launch Complex 1',
    country: 'New Zealand',
    flag: '🇳🇿',
    operator: 'Rocket Lab',
    location: 'Māhia Peninsula, New Zealand',
    coordinates: '39.2606° S, 177.8660° E',
    description: "World's only private orbital spaceport licensed to launch rockets every 72 hours. Primary Southern Hemisphere orbital pad for commercial Smallsat missions.",
    notablePads: ['Pad A (Electron)', 'Pad B (Electron)'],
  },
];

/**
 * Major international space agencies and commercial partners
 */
export const SPACE_AGENCIES: SpaceAgency[] = [
  {
    id: 'nasa',
    name: 'National Aeronautics and Space Administration',
    code: 'NASA',
    country: 'United States',
    flag: '🇺🇸',
    founded: '1958',
    headquarters: 'Washington, D.C., USA',
    roleInIss: 'Primary operational architect, Destiny laboratory, Quest airlock, Integrated Truss & solar arrays.',
    primaryRockets: ['Space Launch System (SLS)', 'Falcon 9 (Commercial Crew)'],
    description: 'Leading civilian space exploration, Artemis lunar program, Mars exploration, and deep space astrophysics.',
    iconName: 'rocket_launch',
  },
  {
    id: 'roscosmos',
    name: 'State Space Corporation Roscosmos',
    code: 'Roscosmos',
    country: 'Russia',
    flag: '🇷🇺',
    founded: '1992',
    headquarters: 'Moscow, Russia',
    roleInIss: 'Zarya Functional Cargo Block, Zvezda Service Module, Nauka Multipurpose Module, Soyuz and Progress flights.',
    primaryRockets: ['Soyuz-2.1a', 'Soyuz-2.1b', 'Proton-M', 'Angara-A5'],
    description: 'Heir to Soviet space legacy; maintains continuous orbital propulsion, reboosts, and human orbital transport.',
    iconName: 'flight_takeoff',
  },
  {
    id: 'esa',
    name: 'European Space Agency',
    code: 'ESA',
    country: '22 European Member States',
    flag: '🇪🇺',
    founded: '1975',
    headquarters: 'Paris, France',
    roleInIss: 'Columbus Research Laboratory, Cupola observatory window module, Automated Transfer Vehicles.',
    primaryRockets: ['Ariane 6', 'Vega-C'],
    description: 'Intergovernmental organization dedicated to space exploration, scientific Earth observation, and deep space astronomy.',
    iconName: 'public',
  },
  {
    id: 'jaxa',
    name: 'Japan Aerospace Exploration Agency',
    code: 'JAXA',
    country: 'Japan',
    flag: '🇯🇵',
    founded: '2003',
    headquarters: 'Chofu, Tokyo, Japan',
    roleInIss: 'Kibō Japanese Experiment Module (largest single ISS module), JEM Robotic Arm, HTV cargo spacecraft.',
    primaryRockets: ['H3', 'H-IIA', 'Epsilon'],
    description: 'Pioneering asteroid sample return (Hayabusa series), lunar precision landings (SLIM), and atmospheric study.',
    iconName: 'science',
  },
  {
    id: 'csa',
    name: 'Canadian Space Agency',
    code: 'CSA / ASC',
    country: 'Canada',
    flag: '🇨🇦',
    founded: '1989',
    headquarters: 'Longueuil, Quebec, Canada',
    roleInIss: 'Canadarm2 (17m robotic arm), Dextre Special Purpose Dexterous Manipulator, Mobile Base System.',
    primaryRockets: ['Commercial Partner Downlinks'],
    description: 'World-renowned leader in space robotics, synthetic aperture radar satellites (RADARSAT), and astronautics.',
    iconName: 'precision_manufacturing',
  },
  {
    id: 'isro',
    name: 'Indian Space Research Organisation',
    code: 'ISRO',
    country: 'India',
    flag: '🇮🇳',
    founded: '1969',
    headquarters: 'Bengaluru, Karnataka, India',
    roleInIss: 'NISAR joint Earth-observing satellite with NASA; developing Gaganyaan human spaceflight program.',
    primaryRockets: ['LVM3 (GSLV Mk III)', 'PSLV', 'SSLV'],
    description: 'Famous for cost-effective deep space missions including Chandrayaan-3 lunar south pole landing and Mars Orbiter.',
    iconName: 'explore',
  },
  {
    id: 'spacex',
    name: 'Space Exploration Technologies Corp.',
    code: 'SpaceX',
    country: 'United States',
    flag: '🇺🇸',
    founded: '2002',
    headquarters: 'Hawthorne, California, USA',
    roleInIss: 'Crew Dragon commercial crew transport (CCP), Cargo Dragon resupply missions, sole US human launch provider since 2020.',
    primaryRockets: ['Falcon 9 Block 5', 'Falcon Heavy', 'Starship Super Heavy'],
    description: 'Revolutionized access to space with reusable rockets. Operates the Starlink broadband constellation and is developing Starship for Moon & Mars.',
    iconName: 'rocket_launch',
  },
  {
    id: 'boeing',
    name: 'The Boeing Company',
    code: 'Boeing',
    country: 'United States',
    flag: '🇺🇸',
    founded: '1916',
    headquarters: 'Arlington, Virginia, USA',
    roleInIss: 'CST-100 Starliner commercial crew vehicle under NASA CCP contract; first crewed mission in 2024.',
    primaryRockets: ['CST-100 Starliner (Atlas V / Vulcan)'],
    description: 'Aerospace giant and NASA legacy contractor. Starliner provides a second American crew vehicle for ISS redundancy under Commercial Crew Program.',
    iconName: 'flight_takeoff',
  },
  {
    id: 'sen',
    name: 'Sen Corporation',
    code: 'Sen Corp',
    country: 'United Kingdom',
    flag: '🇬🇧',
    founded: '2018',
    headquarters: 'London, United Kingdom',
    roleInIss: 'Deployed and operates multi-camera 4K UHD payload on Columbus module, streaming live Earth views to the public.',
    primaryRockets: ['Commercial payload manifest'],
    description: 'Space media and camera technology company. Operates the first commercial 4K streaming cameras aboard the ISS, enabling real-time ultra-high-definition public Earth views.',
    iconName: 'videocam',
  },
  {
    id: 'northrop',
    name: 'Northrop Grumman Corporation',
    code: 'Northrop Grumman',
    country: 'United States',
    flag: '🇺🇸',
    founded: '1939',
    headquarters: 'Falls Church, Virginia, USA',
    roleInIss: 'Cygnus autonomous cargo spacecraft — delivers food, experiments, crew supplies, and can boost ISS orbit.',
    primaryRockets: ['Antares', 'Falcon 9 (NG-20+)'],
    description: "Defense and aerospace prime. Cygnus is a reliable ISS cargo workhorse that can also perform reboost maneuvers to maintain the station's orbital altitude.",
    iconName: 'precision_manufacturing',
  },
  {
    id: 'uaesa',
    name: 'Mohammed bin Rashid Space Centre',
    code: 'MBRSC / UAE',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    founded: '2006',
    headquarters: 'Dubai, United Arab Emirates',
    roleInIss: 'Sent first Arab astronaut Sultan Al Neyadi on a 6-month ISS mission (SpX-Crew-6, 2023); continuing ISS partnership.',
    primaryRockets: ['Commercial crew via SpaceX Crew Dragon'],
    description: "UAE's space ambitions realized: Hope Probe in Mars orbit, Rashid lunar rover, and ISS crew missions establishing the Arab world as a spacefaring nation.",
    iconName: 'public',
  },
  {
    id: 'asi',
    name: 'Italian Space Agency',
    code: 'ASI',
    country: 'Italy',
    flag: '🇮🇹',
    founded: '1988',
    headquarters: 'Rome, Italy',
    roleInIss: 'Built ~50% of ISS pressurized volume (Harmony Node 2, Tranquility Node 3, Cupola, Leonardo PMM) under bilateral NASA agreements.',
    primaryRockets: ['Vega-C (ESA Partner)', 'Ariane 6'],
    description: 'Pioneer of ISS habitat architecture. Italy manufactured the majority of the station\'s pressurized modules, including the famous Cupola observatory window module.',
    iconName: 'engineering',
  },
];

/**
 * Dynamic location facts matched against current coordinates/regions
 */
export const LOCATION_FACTS: LocationFact[] = [
  {
    region: 'Pacific',
    title: 'Point Nemo & The Spacecraft Cemetery',
    fact: 'The South Pacific is home to Oceanic Pole of Inaccessibility (Point Nemo), the most remote place on Earth. Space agencies de-orbit defunct spacecraft and space stations here to ensure zero human impact.',
    highlightMetric: '2,688 km from the nearest dry land',
  },
  {
    region: 'Atlantic',
    title: 'The Bermuda Triangle & Mid-Atlantic Ridge',
    fact: "Crossing the Atlantic Ocean at 7.7 km/s, the ISS traverses the entire ocean from the Americas to Africa in under 10 minutes, passing high above the volcanic Mid-Atlantic underwater mountain range.",
    highlightMetric: '~9.5 minutes to cross Atlantic',
  },
  {
    region: 'Indian',
    title: 'Monsoon Atmospheric Telemetry',
    fact: "Astronauts frequently photograph immense cloud formations and cyclonic activity across the Indian Ocean, which provides critical meteorological calibration data for ESA and NASA Earth science.",
    highlightMetric: '27,600 km/h cruising velocity',
  },
  {
    region: 'Africa',
    title: 'Richat Structure & The Sahara Desert',
    fact: 'The circular "Eye of the Sahara" (Richat Structure) in Mauritania is a key visual landmark for astronauts in orbit. Originally thought to be an asteroid crater, it is a deeply eroded geologic dome.',
    highlightMetric: '50 km wide geological landmark',
  },
  {
    region: 'America',
    title: 'The Amazon Basin & Aurora Borealis',
    fact: 'Flying over the Americas, the ISS crew witnesses the vast green canopy of the Amazon rain forest by day, and dancing curtains of the northern lights (Aurora Borealis) during orbital night at high latitudes.',
    highlightMetric: '16 sunrises & sunsets every 24 hours',
  },
  {
    region: 'Asia',
    title: 'The Roof of the World',
    fact: 'The snow-capped Himalayan mountains and Tibetan Plateau rise over 8,000 meters above sea level, yet the ISS skims far above in low Earth orbit at an altitude of approximately 420 kilometers.',
    highlightMetric: '420 km station altitude',
  },
  {
    region: 'Europe',
    title: 'The Golden Web of City Lights',
    fact: 'Night passes over Europe reveal intricate urban light networks connecting London, Paris, and Berlin. Astronauts use high-sensitivity digital cameras to study light pollution and energy consumption.',
    highlightMetric: '92.68 minute orbital period',
  },
  {
    region: 'Default',
    title: 'Low Earth Orbit Microgravity',
    fact: "At an altitude of 420 km, Earth's gravity is still 90% as strong as on the surface. The ISS stays weightless because it is in perpetual free fall around Earth at orbital velocity (~27,600 km/h).",
    highlightMetric: '90% Earth gravity in freefall',
  },
];

export function getFactForLocation(locationName: string): LocationFact {
  const lower = locationName.toLowerCase();
  for (const item of LOCATION_FACTS) {
    if (lower.includes(item.region.toLowerCase())) {
      return item;
    }
  }
  return LOCATION_FACTS[LOCATION_FACTS.length - 1];
}
