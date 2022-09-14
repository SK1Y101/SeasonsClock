function mySettings(props) {
return (
    <Page>
    <Section
        title={<Text bold align="center">Application Settings</Text>}>
        <Text>This application requires an API key from the OpenWeatherMap for the following functions: Weather, Accurate Moon and Sun Position.</Text>
        <TextInput
            label="API Key"
            title="OpenWatherMap API Key"
            settingsKey="textInput"
            disabled={!(props.settings.toggleTextInput === "true")}
        />
        <Toggle
            label="Enable editing API Key"
            settingsKey="toggleTextInput"
        />
        <Link source="https://home.openweathermap.org/users/sign_up">Sign up for the free API key here to use the entire feature set, and enter the key below</Link>
    </Section>
    <Section
        title={<Text bold align="center">Additional links</Text>}>
        <Link source="https://github.com/SK1Y101/SeasonsClock">The development page for this project.</Link>
        {/* <Link source="https://github.com/SK1Y101/SeasonsClock/wiki">Wiki for this watch face.</Link> */}
        <Link source="https://www.buymeacoffee.com/lloydwaltersj">Support my work!</Link>
    </Section>
    </Page>
);
}

registerSettingsPage(mySettings);  