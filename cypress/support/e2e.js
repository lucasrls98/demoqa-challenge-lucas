import 'cypress-mochawesome-reporter/register';
import 'cypress-real-events';
import { register as registerCypressGrep } from '@cypress/grep';
import './commands';
import './accessibility';

registerCypressGrep();
