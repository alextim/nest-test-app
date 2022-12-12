type TemplateVariables = Record<string, string | number>;

type ParseMailTemplateDto = {
  file: string;
  variables: TemplateVariables;
};

export default ParseMailTemplateDto;
