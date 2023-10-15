 

import {BLANK_CONCAT_2NDROW_PREVIOUS_HEADER,
CONCAT_1STROW_HEADER_2NDROW_HEADER,
ROW_1ST_HAS_HEADERS,
SECOND_ROW_HAS_HEADERS} from './constants/surveyConstants'

export const surveysConfigurations = [
  {
    surveyName: 'OnCare Treatment Center',
    subSurvey: [
      {
      _id: '1',
      subSurveyName: 'Informacion General Paciente',
      headerParserModificators: [ 
        {
          modificator: BLANK_CONCAT_2NDROW_PREVIOUS_HEADER, 
          startColumn: 0,
          endColumn: 23,
        }
      ]

    },
    {
      _id: '2',
      subSurveyName: 'CGS',
      headerParserModificators: [ 
        {
          modificator: BLANK_CONCAT_2NDROW_PREVIOUS_HEADER, 
          startColumn: 24,
          endColumn: 51,
        }
      ]
    },
    {
      _id: '3',
      subSurveyName: 'FIAD-15 (NOFP)',
      headerParserModificators: [ 
        {
          modificator: SECOND_ROW_HAS_HEADERS, 
          startColumn: 52,
      endColumn: 66,
        }
      ]
    },
    {
      _id: '4',
      subSurveyName: 'ENCUESTA 4',
      headerParserModificators: [ 
        {
          modificator: SECOND_ROW_HAS_HEADERS, 
          startColumn: 67,
          endColumn: 88,
        }
      ]
    },
    {
      _id: '5',
      subSurveyName: 'ENCUESTA 5',
      description: 'Instrucciones: a continuación marque los sucesos que ha vivido en el último año.',
      headerParserModificators: [ 
        {
          modificator: SECOND_ROW_HAS_HEADERS, 
          startColumn: 89,
          endColumn: 128,
        }
      ]
    },
    {
      _id: '6',
      subSurveyName: 'ENCUESTA 6',
      description: 'Instrucciones: La respuesta corresponde a los 7 días previos. Deberá calificarse el grado de intensidad de acuerdo a la siguiente escala. Anotando el número correspondiente dentro del paréntesis.',
      headerParserModificators: [ 
        {
          modificator: SECOND_ROW_HAS_HEADERS, 
          startColumn: 129,
          endColumn: 141,
        }
      ]
    },
    {
      _id: '7',
      subSurveyName: 'ENCUESTA 7',
      description: 'Instrucciones: Indique el grado hasta el que está de acuerdo o en desacuerdo con cada una de las siguientes afirmaciones según la siguiente escala.Instrucciones: La respuesta corresponde a los 7 días previos. Deberá calificarse el grado de intensidad de acuerdo a la siguiente escala. Anotando el número correspondiente dentro del paréntesis.',
      headerParserModificators: [ 
        {
          modificator: SECOND_ROW_HAS_HEADERS, 
          startColumn: 142, 
          endColumn: 161,
        }
      ]
    },
    {
      _id: '8',
      subSurveyName: 'ENCUESTA 8',
      description: 'NPI',
      headerParserModificators: [ 
        {modificator: CONCAT_1STROW_HEADER_2NDROW_HEADER, startColumn: 162, endColumn: 205},
        {modificator: ROW_1ST_HAS_HEADERS, startColumn: 206, endColumn: 215 }, 
      ]
    },
    {
      _id: '9',
      subSurveyName: 'ENCUESTA 9',
      description: 'Señale hasta que punto se ha sentido molesto por el síntoma:',
      headerParserModificators: [ 
        {
          modificator: SECOND_ROW_HAS_HEADERS, 
          startColumn: 216,
          endColumn: 305,
        }, 
      ]
    },
    {
      _id: '10',
      subSurveyName: 'ENCUESTA 10',
      description: 'Instrucciones: Indique su grado de acuerdo o desacuerdo en cada una de las siguientes afirmaciones marcando el espacio apropiado. Utilice la siguiente escala de 7 puntos (un mayor número en la escala indica un mayor acuerdo).',
      headerParserModificators: [ 
        {
          modificator: SECOND_ROW_HAS_HEADERS, 
          startColumn: 306,
          endColumn: 325,
        }, 
      ]
    },
    {
      _id: '11',
      subSurveyName: 'ENCUESTA 11',
      description: 'NPI',
      headerParserModificators: [ 
        {
          modificator: ROW_1ST_HAS_HEADERS, 
          startColumn: 326,
          endColumn: 331,
        }, 
        {
          modificator: BLANK_CONCAT_2NDROW_PREVIOUS_HEADER, 
          startColumn: 332,
          endColumn: 332,
        },
        {
          modificator: ROW_1ST_HAS_HEADERS, 
          startColumn: 333,
          endColumn: 343,
        },
      ]
    },
]
  }
    
]
