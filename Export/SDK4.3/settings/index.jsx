function mySettings(props) {
return (
    <Page>
        <Section title={<Text bold align="center">Customisation Settings</Text>}>
            <AdditiveList
                settingsKey="shownStats"
                maxItems="2"
                addAction={
                    <Select
                        label="Add Stat to show on the watchface"
                        options={[
                            {name: "Battery Charge", value:"batCharge"},
                            {name: "Current Date", value:"curDate"},
                        ]}
                    />
                }
            />
            <Select
            label={"Date Format"}
            settingsKey="dateFormat"
            options={[
                {value: 0,  example:"31/12",                name:"   DD-MM"},
                // {value: 1,  example:"12/31",                name:"   MM-DD"},
                {value: 2,  example:"31 Dec",               name:"   DD-Mon"},
                // {value: 3,  example:"Dec 31",               name:"   Mon-DD"},
                {value: 4,  example:"31 December",          name:"   DD-Month"},
                // {value: 5,  example:"December 31",          name:"   Month-DD"},
                // {value: 10,  example:"Sun, 31/12",           name:"dS-DD-MM"},
                // {value: 11,  example:"Sun, 12/31",           name:"dS-MM-DD"},
                {value: 12,  example:"Sun, 31 Dec",          name:"dS-DD-Mon"},
                // {value: 13,  example:"Sun, Dec 31",          name:"dS-Mon-DD"},
                {value: 14,  example:"Sun, 31 December",     name:"dS-DD-Month"},
                // {value: 15,  example:"Sun, December 31",     name:"dS-Month-DD"},
                // {value: 21,  example:"Sunday, 31/12",        name:"dL-DD-MM"},
                // {value: 22,  example:"Sunday, 12/31",        name:"dL-MM-DD"},
                {value: 23,  example:"Sunday, 31 Dec",       name:"dL-DD-Mon"},
                // {value: 24,  example:"Sunday, Dec 31",       name:"dL-Mon-DD"},
                {value: 25,  example:"Sunday, 31 December",  name:"dL-DD-Month"},
                // {value: 26,  example:"Sunday, December 31",  name:"dL-Month-DD"},
            ]}
            renderItem={
                (option) =>
                <TextImageRow
                    label={option.name}
                    sublabel={option.example}
                />
            }
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