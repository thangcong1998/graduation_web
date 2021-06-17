import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";

import Collapse from "@material-ui/core/Collapse";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useAttributeGroup } from "./useAttribute";
import { Input } from "../form/Form";
import Grid from "@material-ui/core/Grid";
import { useTranslation } from "react-i18next";

const AttributeContext = React.createContext();

export default React.memo(
  ({ category, defaultData, onChange, errors, readOnly }) => {
    const defaultAttribute = useAttributeGroup(category);

    const { t, i18n } = useTranslation();

    const language = i18n.languages[0];
    // const [language, setLanguage] = useState(]);
    useEffect(() => {
      // moment.locale(language);
    }, [language]);

    const [valuesMap, setValuesMap] = useState();
    useEffect(() => {
      if (defaultData !== undefined) {
        setValuesMap(defaultData);
      }
    }, [defaultData]);
    useEffect(() => {
      onChange(valuesMap);
    }, [valuesMap]);
    const handleChange = useCallback((id, value) => {
      setValuesMap((valuesMap) => ({ ...valuesMap, [id]: value }));
    }, []);

    const value = useMemo(() => [valuesMap, handleChange, errors, readOnly], [
      valuesMap,
      handleChange,
      errors,
      readOnly,
    ]);
    return (
      <AttributeContext.Provider value={value}>
        {defaultAttribute.length > 0 && (
          <h1>{t("user_screen.additional_information")}</h1>
        )}
        {language == "vi" && (
          <div>
            {defaultAttribute.map((group) => (
              <FormGroup group={group} key={group.name} />
            ))}
          </div>
        )}
        {language == "en" && (
          <div>
            {defaultAttribute.map((group) => (
              <FormGroup group={group} key={group.english_name} />
            ))}
          </div>
        )}
      </AttributeContext.Provider>
    );
  }
);

export function FormGroup({ group }) {
  const [values, handleChange, errors, readOnly] = useContext(AttributeContext);
  const isFirstGroup = "category" in group;
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const language = i18n.languages[0];
  useEffect(() => {}, [language]);
  const [callbacks, setCallbacks] = useState({});
  //hide empty group
  const childrenWithValues = group.children.filter(
    (el) => values?.[el.id] === 0 || values?.[el.id]
  );
  if (childrenWithValues.length === 0 && readOnly) return null;

  const style = {
    border: "unset",
  };

  return (
    <fieldset style={open ? null : style}>
      <legend
        //only top level group has a key named 'category'
        className={isFirstGroup ? "legend-lv0" : "legend-lv1"}
        onClick={() => setOpen(!open)}
      >
        <span style={{ marginRight: 5 }}>
          {open ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </span>
        {language == "vi" && (
          <span style={{ fontSize: "1.25rem" }}>{group.name}</span>
        )}
        {language == "en" && (
          <span style={{ fontSize: "1.25rem" }}>{group.english_name}</span>
        )}
      </legend>

      <Collapse in={open}>
        <Grid container spacing={3}>
          {group.children.map((el, idx) => {
            //hide null value
            if (readOnly) {
              if (!values[el.id] && values[el.id] !== 0) return null;
            }
            //memoize onChange callback for each element
            if (!callbacks[el.id]) {
              setCallbacks({
                ...callbacks,
                [el.id]: (val) => handleChange(el.id, val),
              });
            }
            return !el.children ? (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                {language == "vi" && (
                  <Input
                    variant="outlined"
                    label={el.name}
                    type={el.type}
                    value={values?.[el.id]}
                    handleChange={callbacks[el.id]}
                    error={errors?.[`attributes.${el.id}`]}
                    options={el.options}
                    readOnly={readOnly}
                  />
                )}
                {language == "en" && (
                  <Input
                    variant="outlined"
                    label={el.english_name}
                    type={el.type}
                    value={values?.[el.id]}
                    handleChange={callbacks[el.id]}
                    error={errors?.[`attributes.${el.id}`]}
                    options={el.options}
                    readOnly={readOnly}
                  />
                )}
              </Grid>
            ) : (
              <Grid item key={idx} xs={12}>
                <FormGroup group={el} />
              </Grid>
            );
          })}
        </Grid>
      </Collapse>
    </fieldset>
  );
}
