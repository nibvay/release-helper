# Project Changelog

#### Next Version
* v1.34.1
  - [ENOP-4266] add feature-account into i18n preload namespace

* v1.34.0
  - [ENOP-4222] fix battery operating and status in table
  - [ENOP-4241] add total charge capacity to profile
  - [ENOP-4253] fix get empty employee
  - [ENOP-4204] fix issue that get battery transfer with no employee information
  - [ENOP-4238] add success popup in transfer action completed

* v1.33.3
  - [ENOP-4233] fix hub attribute models
  - [ENOP-4234] Extend the time interval between the update/create operation and the get operation
  - [ENOP-4235] fix issue that error happened while creating battery transfer with 0 batteries in source hub
  - [ENOP-4239] reset input sn field on error occurrence

#### Released
* v1.35.0
  - [ENOP-4224][ENOP-4184] upgrade feature account
  - [ENOP-4275] fix transfer in time
  - [ENOP-4282] fix issue that feature - batch batteries query cannot get location info correctly.
  - fix: test commit 001 ([#07fe1017](https://gitlab.gogoro.com/enop-plus/gnop-app/-/commit/07fe1017))

* v1.33.2
  - [ENOP-4227] fix transfer ticket status update

* v1.33.1
  - [ENOP-4216] format dashboard number

* v1.33.0
  - [ENOP-4117] battery profile page refactor
  - [ENOP-4137] fix getAll function of combined battries
  - [ENOP-4136] fix pagination header for batch
  - [ENOP-4138] fix /battery/search/vm api for search by rid
  - [ENOP-4143] fixed issue that page - battery swap query get incorrect error message when query by invalid vehicle tag and battery.
  - [ENOP-4141] fixed issue that page - multi query get incorrect error message when query by invalid scooter guid.
  - [ENOP-4144] add close button in location popup
  - [ENOP-4142] UI revising
  - [ENOP-4142-2] UI revising
  - [ENOP-4145] remove battery id when export
  - [ENOP-4153] fix location distribution total
  - [ENOP-4152] feature - sbms battery dashboard show new values for battery count of different available status completed
  - [ENOP-4172] fix project scanned battery
  - [ENOP-4168] fix save button check in battery scan popup
  - [ENOP-4170] fix ConfirmBox when recall battery to accepted hub
  - [ENOP-4171] enhance hub picker
  - [ENOP-4145] filter lrm character in download csv file
  - [ENOP-4145] replace all lrm character
  - [ENOP-4157] fixed issue that cannot get correct battery information while searching batteries with large count batteries.
  - [feat] reset batteries when change hub
  - [ENOP-4177] disable save button when no battery is scanned
  - [ENOP-4131-2] fixed issue that The number of Hub result count will be one more for API - /managing/battery-qty
  - [fix] battery transfer popup unsave checker
  - [ENOP-4181] fixed issue that API - /search/bp-list/export cannot get csv with correct scooter information
  - [enhance] remark field editable
  - [ENOP-4197] fixed issue that API - /dashboard return incorrecrt number(column - operationStatus total) when data is null
  - [fix] side menu i18n

* v1.32.4
  - [ENOP-4131] fixed issue that The number of Hub result count will be one more.

* v1.32.3
  - [hotfix] add validation to aviod searching all batteries

* v1.32.2
  - [ENOP-4054] fix transfer popup date format
  - [ENOP-4092] fixed issue that API - v1/battery/batch cannot get more than 200 batteries info

* v1.32.1
  - [ENOP-4027] update i18n
  