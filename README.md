# IRIDIUM

***********************************************************************************
***********************************************************************************
***********************************************************************************
***********************************************************************************
****    ####   ########    ####   ########    ####   ##     ##   ##     ##    *****
****     ##    ##     ##    ##    ##     ##    ##    ##     ##   ###   ###    *****
****     ##    ##     ##    ##    ##     ##    ##    ##     ##   #### ####    *****
****     ##    ########     ##    ##     ##    ##    ##     ##   ## ### ##    *****
****     ##    ##   ##      ##    ##     ##    ##    ##     ##   ##     ##    *****
****     ##    ##    ##     ##    ##     ##    ##    ##     ##   ##     ##    *****
****    ####   ##     ##   ####   ########    ####    #######    ##     ##    *****
***********************************************************************************
***********************************************************************************
***********************************************************************************
***********************************************************************************


13 NOV 2019        [Version 3.1.0.0]
correlation matrix
>Updates in correlation matrix 
Area Search
>Updates in  area search

14NOV2019			[Version 3.1.0.1]
Data Visualization
>changes in correlation matrix and area search improvements in selection, scaling and visualization

15NOV2019			[Version 3.1.0.2]
area search 
>area search Implementation updates

18NOV2019			[Version 3.1.0.3]
>updates in app.js Endpoints NodeJS
fixed the timeout issue
>file upload
fixed the zip and csv file upload and pop call issue
>predication continuous
updated prediction continuous screen

19NOV2019			[Version 3.1.0.4]
>Overall
prediction continuous implementation
get tag list optimization
chart axes fixed

20NOV2019			[Version 3.1.0.5]
Predication Continues
>updated predication continues screen
>add tool tip in prediction screen for tags
>added error message for prediction screen
DASHBOARD
>updated dashboard tag list endpoint to get dashboard tag list
Overall
>updated derived and aggregated tag removed the min/max from the search filter
>remove the link from the logo of iridium
Fingerprint
>enabled the alerts and fingerprints

21NOV2019			[Version 3.1.2.1]  [Version 3.1.2.2] 
(2 commits)
DASHBOARD
> Text chopped when user update the Line chart graph's max value
>Logo should not be Clickable, as dashboard link does same
>Wrong value displayed in the KPI tile when value greater than 1000 with floating point
>line chart and compare chart axes right to left align with start and end label
Area Search
> Crooked line message
Overall			
>add version info
>tag select list  min/max range removed
Deriver Tag
>End point  Get Tag List  408 status code (request timeout) after 10 mins
>complete text field should be clickable
Deriving Factor
>For Larger Tag Names, Action Buttons disappears
Prediction Continues
>Error message handling

22NOV2019			[Version 3.2.2.3]
Tag Search
>tag Search list updates in deriving factor, prediction continues
prediction continues
>prediction continues endpoint updates

25NOV2019			[Version 3.2.2.4]
 Alert Screen
>remove info icon from edit alerts
>change the text remove to delete on button
Driving Factor
>verify the tag select list like trend analysis
Dashboard
>update the last hour tag form line chart and compare chart to left to right align
Predication Continues
>fixed the trend analysis not text in tooltip
>added the number field validation
Overall Application
>change date range 'Yesterday' feature to 'last 24 hours'

26NOV2019			[Version 3.2.3.0]
Alerts
>add alerts pattern selection updated
Prediction continues
>multiple time prediction call check add
>unique tag list

27NOV2019			[Version 3.2.3.1]
Prediction Continues
>Active tag refresh on page switch
>active list text misalign
>new predicted series properly append with current series
pattern matching
>area highlight for finger print algo updated

02DEC2019  04DEC2019		[Version 3.3.4.3]
Overall
>datetime selector  'today' selector updated
Prediction Continues
>get Tag Trend loader issue
>Historical Date changed from 1 year to Tag available minimum range
>predication 500 endpoint exception handling and error message
Trend Analysis
>set axis list not updated on tag addition
Dashboard
>slider  tile font issue
>CTO gauge added
Deriving Factor
>Active tag list Duplication
>Lag icon styling

05JAN2019					[Version 3.3.5.4]
Derived Tag
>blocked enter key input in description
Aggregated Tag
>blocked enter key input in description
Alerts
>alert detail section trend visualization fixed the time zone conversion
Fingerprint
>Create Value based Alerts
>Delete Value Based Alerts
Dashboard
>Slider Gauge inputs finalized locked for Dev
>Basic Validation and Text heading edit option added in the edit section

10JAN2019					[Version 3.3.6.5]
Alerts
>Create and Delete Value Based Alerts Implemented
Dashboard
>slider gauge value based implementation and Tag Based Implementation
>Kpi last value unit not showing issue fixed
overall
>google analytic code added
>modal upload port updated
Modal Management
>port 84 updated to 88 for all modal API's

17JAN2020					[Version 4.0.0.1]
Overall
>Routing issue fixed
>SSL implemented
>Seconds added in overall all visualizations
Derving Factor
>Text overflow issue fixed
File Upload
>Seconds in datetime selection added
Trend Analysis
>Unit Added in tooltip

20JAN2020					[Version 4.0.1.2]
Trend Analysis
>Tooltip unit implementation changed
>unit added in chart tooltip config
Derived Tag
>Css overflow issue fixed
Alerts
>Seconds config added in charts
>block value based trend call
>Alert detail response issue fixed
>tag name and unit integrated in alert detail
Deriving Factor
>'no tag selected' message updated to 'please select a tag'
Pattern Recongnation
>Timestamp removed from taglist
>seconds added in result list
>unit added in chart tooltip config
Value Based Search
>seconds added in result list
>unit added in chart tooltip config
Overall
>Unit Integrated in tooltips in all visualizations
