export interface ICountryRoot {
  success: boolean;
  countries: ICountryDoc[];
}

export interface ICountryDoc {
  id: number;
  name: string;
  code: string;
}

export interface IStatesRoot {
  success: boolean;
  states: IStateDoc[];
}

export interface IStateDoc {
  id: number;
  name: string;
}

export interface ICitiesRoot {
  success: boolean;
  cities: ICityDoc[];
}

export interface ICityDoc {
  id: number;
  name: string;
}
