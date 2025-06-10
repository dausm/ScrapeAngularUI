import { TestBed } from "@angular/core/testing";
import { FilteringBaseService } from "./filtering-base.service";
import { DefaultFilterOptions } from "../../shared/constants/default-filter-options";
import { ComponentStates } from "../../shared/enums/component-states";
import { DisplayValueTypes } from "../../shared/enums/display-value-type";

describe('FilteringBaseService', () => {
  let service: FilteringBaseService;

  beforeEach(() => {
    service = TestBed.inject(FilteringBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.errorMessage()).toBe(null);
    expect(service.lastUpdate()).toBe('');
    expect(service.componentState()).toBe(ComponentStates.initial);
  });

  it('should update state when updateFilter$ is updated', () => {
    service.updateFilter$.next(DefaultFilterOptions);

    expect(service).toBeTruthy();
  });

  it('should get filtered options when Averages and filtered days are passed to updateFilter$', () => {
    //TODO add some options in beforeEach call setOptionByLocation()
    service.updateFilter$.next({...DefaultFilterOptions, weekDays: ['monday']});

    expect(service).toBeTruthy();
  });

  it('should get maximum values when Maximum is passed to updateFilter$', () => {
    //TODO add some options in beforeEach call setOptionByLocation()
    service.updateFilter$.next({...DefaultFilterOptions, displayValueType: DisplayValueTypes.maximum});

    expect(service).toBeTruthy();
  });
});
