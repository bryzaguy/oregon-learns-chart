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
  priority: ['B', 'A', 'C', 'Z', 'F', '4', 'T', '2', 'G', 'D', 'X', 'H'],
  filterGroups: [{
    name: 'Achievements',
    codes: ['B', 'A', 'C', 'D', 'Z']
  }, {
    name: 'First Enrollment',
    codes: ['2', '4']
  }, {
    name: 'Second Enrollment',
    codes: ['T', 'F']
  }, {
    name: 'Highschool Graduate',
    codes: ['H', 'X']
  }]
};