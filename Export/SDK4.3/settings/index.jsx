function mySettings(props) {
return (
    <Page>
        <Section title={<Text bold align="center">Stats Display Modules</Text>}>
            <AdditiveList
                settingsKey="shownStats"
                maxItems="4"
                addAction={
                    <Select
                        label="Add Stat to show on the watchface"
                        options={[
                            {name: "Battery Charge",    value:"batCharge"},
                            {name: "Battery Remaining", value:"batDisCharge"},
                            {name: "Current Date",      value:"curDate"},
                        ]}
                    />
                }
            />
        </Section>
        <Section title={<Text bold align="center">Application Settings</Text>}>
            <Select
                settingsKey="dateFormat"
                label="Date format"
                options={[
                    {name: "2020-12-31",          value:"year-monthNum-dayNum"},
                    {name: "31/12",               value:"dayNum/monthNum"},
                    {name: "31 Dec",              value:"dayNum monthShort"},
                    {name: "31 December",         value:"dayNum monthLong"},
                    {name: "Sun, 31/12",          value:"dayShort, dayNum/monthNum"},
                    {name: "Sun, 31 Dec",         value:"dayShort, dayNum monthShort"},
                    {name: "Sun, 31 December",    value:"dayShort, dayNum monthLong"},
                    {name: "Sunday, 31/12",       value:"dayLong, dayNum/monthNum"},
                    {name: "Sunday, 31 Dec",      value:"dayLong, dayNum monthShort"},
                    {name: "Sunday, 31 December", value:"dayLong, dayNum monthLong"},
                ]}
            />
        </Section>
        <Section title={<Text bold align="center">Application Settings</Text>}>
            <Text>
                This application requires a free API key from the OpenWeatherMap to access and show current weather data.
                Without this, the application will show a simple static background instead.
            </Text>
            <TextInput
                label="API Key"
                title="OpenWatherMap API Key"
                settingsKey="apiKey"
                disabled={!(props.settings.toggleTextInput === "true")}
            />
            <Toggle
                label="Enable editing API Key"
                settingsKey="toggleTextInput"
            />
            <Link source="https://home.openweathermap.org/users/sign_up">Sign up to obtain an API key here, and enter in the box above.</Link>
        </Section>
        <Section title={<Text bold align="center">Additional links</Text>}>
            <Link source="https://github.com/SK1Y101/SeasonsClock">The development page for this project.</Link>
            {/* <Link source="https://github.com/SK1Y101/SeasonsClock/wiki">Wiki for this watch face.</Link> */}
            <Link source="https://www.buymeacoffee.com/lloydwaltersj">Support my work!</Link>
        </Section>
    </Page>
);
}

registerSettingsPage(mySettings);  