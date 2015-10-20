'use strict';

module.exports = {
  codes: {
    B: "Bachelor+",
    A: "Associate",
    C: "Certificate",
    Z: "No achievements",
    F: "Enroll 4 Year",
    T: "Enroll 2 Year",
    4: "Enroll 4 Year",
    2: "Enroll 2 Year",
    G: "HS Graduate",
    D: "HS Diploma",
    X: "Did not graduate",
    H: "Highschool",
  },
  priority: ['B', 'A', 'C', 'D', 'Z', 'F', '4', 'T', '2', 'G', 'X', 'H'],
  filterGroups: [{
    name: 'Achievements',
    id: 'achievements-filters',
    codes: ['B', 'A', 'C', 'D', 'Z']
  }, {
    name: 'First Enrollment',
    id: 'first-enrollment-filters',
    codes: ['4', '2']
  }, {
    name: 'Second Enrollment',
    id: 'second-enrollment-filters',
    codes: ['F', 'T']
  }, {
    name: 'Highschool Graduate',
    id: 'hs-graduate-filters',
    codes: ['G', 'X']
  }]
};