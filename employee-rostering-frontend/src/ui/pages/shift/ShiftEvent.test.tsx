/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import Spot from 'domain/Spot';
import Employee from 'domain/Employee';
import Shift from 'domain/Shift';
import ShiftEvent, * as shiftEvent from './ShiftEvent';
import EmployeeAvailability from 'domain/EmployeeAvailability';
import moment from 'moment-timezone';
import "moment/locale/en-ca";

describe('ShiftEvent', () => {
  it('getRequiredSkillViolations should render correctly', () => {
    const shift: Shift = {
      ...baseShift,
      requiredSkillViolationList: [{
        score: { hardScore: -10,  mediumScore: 0, softScore: 0 },
        shift: baseShift
      }]
    };
    const requiredSkillViolations = mount(shiftEvent.getRequiredSkillViolations(shift));
    expect(toJson(requiredSkillViolations)).toMatchSnapshot();
  });

  it('getContractMinutesViolations should render correctly', () => {
    const shift: Shift = {
      ...baseShift,
      contractMinutesViolationPenaltyList: [
        {
          employee: employee,
          type: 'DAY',
          minutesWorked: 20,
          score: { hardScore: -1, mediumScore: 0, softScore: 0 }
        },
        {
          employee: employee,
          type: 'WEEK',
          minutesWorked: 80,
          score: { hardScore: -1, mediumScore: 0, softScore: 0 }
        },
        {
          employee: employee,
          type: 'MONTH',
          minutesWorked: 600,
          score: { hardScore: -1, mediumScore: 0, softScore: 0 }
        },
        {
          employee: employee,
          type: 'YEAR',
          minutesWorked: 7000,
          score: { hardScore: -1, mediumScore: 0, softScore: 0 }
        }
      ]
    };

    const contractMinutesViolations = mount(shiftEvent.getContractMinutesViolations(shift));
    expect(toJson(contractMinutesViolations)).toMatchSnapshot();
  });

  it('getUnavaliableEmployeeViolations should render correctly', () => {
    const unavaliableAvailability: EmployeeAvailability = {
      ...baseEmployeeAvailability,
      state: "UNAVAILABLE"
    };
    const shift: Shift = {
      ...baseShift,
      unavailableEmployeeViolationList: [{
        score: { hardScore: -1, mediumScore: 0, softScore: 0 },
        employeeAvailability: unavaliableAvailability,
        shift: baseShift
      }]
    };
    const unavailableEmployeeViolations = mount(shiftEvent.getUnavaliableEmployeeViolations(shift));
    expect(toJson(unavailableEmployeeViolations)).toMatchSnapshot();
  });

  it('getShiftEmployeeConflictViolations should render correctly', () => {
    const shift: Shift = {
      ...baseShift,
      shiftEmployeeConflictList: [
        {
          score: { hardScore: -1, mediumScore: 0, softScore: 0},
          leftShift: baseShift,
          rightShift: { ...baseShift, id: 100, startDateTime: moment(baseShift.startDateTime).add(1, 'hour').toDate() }
        },
        {
          score: { hardScore: -1, mediumScore: 0, softScore: 0},
          rightShift: baseShift,
          leftShift: { ...baseShift, id: 101, startDateTime: moment(baseShift.startDateTime).subtract(1, 'hour').toDate() }
        }
      ]
    };
    const shiftEmployeeConflictViolations = mount(shiftEvent.getShiftEmployeeConflictViolations(shift));
    expect(toJson(shiftEmployeeConflictViolations)).toMatchSnapshot();
  });

  it('getRotationViolationPenalties should render correctly', () => {
    const shift: Shift = {
      ...baseShift,
      rotationViolationPenaltyList: [
        {
          score: { hardScore: 0, mediumScore: 0, softScore: -100 },
          shift: baseShift
        }
      ]
    };
    const rotationViolationPenalties = mount(shiftEvent.getRotationViolationPenalties(shift));
    expect(toJson(rotationViolationPenalties)).toMatchSnapshot();
  });

  it('getUnassignedShiftPenalties should render correctly', () => {
    const shift: Shift = {
      ...baseShift,
      unassignedShiftPenaltyList: [
        {
          score: { hardScore: 0, mediumScore: -1, softScore: 0 },
          shift: baseShift
        }
      ]
    };
    const unassignedShiftPenalties = mount(shiftEvent.getUnassignedShiftPenalties(shift));
    expect(toJson(unassignedShiftPenalties)).toMatchSnapshot();
  });

  it('getUndesiredTimeslotForEmployeePenalties should render correctly', () => {
    const undesiredAvailability: EmployeeAvailability = {
      ...baseEmployeeAvailability,
      state: "UNDESIRED"
    };
    const shift: Shift = {
      ...baseShift,
      undesiredTimeslotForEmployeePenaltyList: [{
        score: { hardScore: 0, mediumScore: 0, softScore: -1 },
        employeeAvailability: undesiredAvailability,
        shift: baseShift
      }]
    };
    const undesiredTimeslotForEmployeePenalties = mount(shiftEvent.getUndesiredTimeslotForEmployeePenalties(shift));
    expect(toJson(undesiredTimeslotForEmployeePenalties)).toMatchSnapshot();
  });

  it('getDesiredTimeslotForEmployeeReward should render correctly', () => {
    const desiredAvailability: EmployeeAvailability = {
      ...baseEmployeeAvailability,
      state: "DESIRED"
    };
    const shift: Shift = {
      ...baseShift,
      desiredTimeslotForEmployeeRewardList: [{
        score: { hardScore: 0, mediumScore: 0, softScore: -1 },
        employeeAvailability: desiredAvailability,
        shift: baseShift
      }]
    };
    const desiredTimeslotForEmployeeRewards = mount(shiftEvent.getDesiredTimeslotForEmployeeRewards(shift));
    expect(toJson(desiredTimeslotForEmployeeRewards)).toMatchSnapshot();
  });

  it('getIndictments should render correctly with no indictments', () => {
    const indictments = mount(shiftEvent.getIndictments(baseShift));
    expect(toJson(indictments)).toMatchSnapshot();
  });

  it('getIndictments should render correctly with indictments', () => {
    const shift: Shift = {
      ...baseShift,
      requiredSkillViolationList: [{
        score: { hardScore: -10,  mediumScore: 0, softScore: 0 },
        shift: baseShift
      }],
      rotationViolationPenaltyList: [
        {
          score: { hardScore: 0, mediumScore: 0, softScore: -100 },
          shift: baseShift
        }
      ]
    };
    const indictments = mount(shiftEvent.getIndictments(shift));
    expect(toJson(indictments)).toMatchSnapshot();
  });

  it('getShiftColor should return a color depending on score', () => {
    const getShiftWithScore: (hard: number, medium: number, soft: number) => Shift = (hard,medium,soft) => ({
      ...baseShift,
      indictmentScore: { hardScore: hard, mediumScore: medium, softScore: soft }
    });

    expect({
      negativeHardColor: shiftEvent.getShiftColor(getShiftWithScore(-5,0,0)),
      negativeMediumColor: shiftEvent.getShiftColor(getShiftWithScore(0,-1,0)),
      negativeSoftColor: shiftEvent.getShiftColor(getShiftWithScore(0,0,-10)),
      zeroColor: shiftEvent.getShiftColor(getShiftWithScore(0,0,0)),
      positiveSoftColor: shiftEvent.getShiftColor(getShiftWithScore(0,0,5))
    }).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const shiftEventObj = shallow(<ShiftEvent event={baseShift} title="Employee" onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(toJson(shiftEventObj)).toMatchSnapshot();
  });
});

const spot: Spot = {
  tenantId: 0,
  id: 2,
  version: 0,
  name: "Spot",
  requiredSkillSet: [
    {
      tenantId: 0,
      id: 3,
      version: 0,
      name: "Skill"
    }
  ]
}

const employee: Employee = {
  tenantId: 0,
  id: 4,
  version: 0,
  name: "Employee 1",
  contract: {
    tenantId: 0,
    id: 5,
    version: 0,
    name: "Basic Contract",
    maximumMinutesPerDay: 10,
    maximumMinutesPerWeek: 70,
    maximumMinutesPerMonth: 500,
    maximumMinutesPerYear: 6000
  },
  skillProficiencySet: [{
    tenantId: 0,
    id: 6,
    version: 0,
    name: "Not Required Skill"
  }]
}

const baseEmployeeAvailability: Omit<EmployeeAvailability, "state"> = {
  tenantId: 0,
  id: 8,
  version: 0,
  startDateTime: moment("2018-07-01T09:00").toDate(),
  endDateTime: moment("2018-07-01T17:00").toDate(),
  employee: employee
};

const baseShift: Shift = {
  tenantId: 0,
  id: 1,
  version: 0, 
  startDateTime: moment("2018-07-01T09:00").toDate(),
  endDateTime: moment("2018-07-01T17:00").toDate(),
  spot: spot,
  employee: employee,
  rotationEmployee: {
    ...employee,
    id: 7,
    name: "Rotation Employee"
  },
  pinnedByUser: false,
  indictmentScore: { hardScore: 0, mediumScore: 0, softScore: 0 },
  requiredSkillViolationList: [],
  unavailableEmployeeViolationList: [],
  shiftEmployeeConflictList: [],
  desiredTimeslotForEmployeeRewardList: [],
  undesiredTimeslotForEmployeePenaltyList: [],
  rotationViolationPenaltyList: [],
  unassignedShiftPenaltyList: [],
  contractMinutesViolationPenaltyList: []
};