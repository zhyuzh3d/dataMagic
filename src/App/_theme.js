import { createMuiTheme } from 'material-ui/styles';
import teal from 'material-ui/colors/teal';
import pink from 'material-ui/colors/pink';
import red from 'material-ui/colors/red';

const Theme = createMuiTheme({
    palette: {
        primary: teal,
        accent: pink,
        error: red,
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius: 0,
                boxShadow: 'none',
            },
            raised: {
                borderRadius: 0,
                boxShadow: 'none',
            },
        },
    },
});

export default Theme;
