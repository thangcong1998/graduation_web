import { useMemo, useState, useEffect } from "react";
import { useAPI, useFetch } from "../../api/api";
import moment from "moment";

const checkIsSubGroup = (label) => {
  let match = label.match(/\[(.*?)\]/);
  if (!match) return false;
  return [match[1], label.replace(/\[(.*?)\]/, "").slice(1)];
};

const subGroups = (att, parentArr) => {
  const isGroup = checkIsSubGroup(att.name);
  if (!isGroup) {
    return [...parentArr, att];
  }

  const [sGroupName, inputName] = isGroup;
  const index = parentArr.findIndex((group) => group.name === sGroupName);
  if (index === -1) {
    //new small group
    const sGroup = {
      name: sGroupName,
      children: [{ ...att, name: inputName }],
    };
    return [...parentArr, sGroup];
  }

  //add att to small group
  const sGroup = { ...parentArr[index] };
  sGroup.children = [...sGroup.children, { ...att, name: inputName }];
  let newArr = [...parentArr];
  newArr[index] = sGroup;
  return newArr;
};

const groups = (list) => {
  return list.reduce((result, att) => {
    const index = result.findIndex((group) => group.id === att.group_id);
    if (index === -1) {
      const newGroup = { ...att.group };
      newGroup.children = subGroups(att, []);
      return [...result, newGroup];
    }
    let group = result[index];
    group.children = subGroups(att, group.children);
    return result;
  }, []);
};

export const useAttributeGroup = (category) => {
  const attributes = useAttribute(category);
  return useMemo(() => groups(attributes), [attributes]);
};

export default function useAttribute(attributeCategory) {
  const [attributes, setAttributes] = useState([]);
  const { data, revalidate } = useFetch([
    "get",
    `admin/attributeGroup?category_equal=${attributeCategory}`,
  ]);

  useEffect(() => {
    if (data?.data?.length > 0) {
      const _attributes = data.data
        .reduce((a, c) => [...a, ...c.children], [])
        .map((att) => ({
          ...att,
          title: att.name, //column identifier
          label: att.name, //filter input label
          field: `:${att.id}`, //filter identifier
          type: att.value_type, //filter type
          options: att.value_list //filter options
            ?.split(",")
            .map((option) => ({ label: option, value: option })),
          checked: false,
          data: (row) => {
            const att_value = row?.attributes?.find(
              (attribute) => attribute.id === att.id
            )?.pivot.value;
            if (att.value_type === "date" && att_value)
              return moment(att_value).format("DD-MM-YYYY");
            return att_value;
          },
          props: {
            flexGrow: 1,
          },
        }));
      setAttributes(_attributes);
    }
  }, [data]);

  return attributes;
}
