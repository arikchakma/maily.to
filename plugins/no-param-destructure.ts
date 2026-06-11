import { definePlugin } from '@oxlint/plugins';
import type { ESTree, Rule } from '@oxlint/plugins';

// @oxlint/plugins types BindingIdentifier.typeAnnotation as `null`,
// but the runtime AST includes full TSTypeAnnotation for TS files.
type IdentifierWithAnnotation = Omit<
  ESTree.BindingIdentifier,
  'typeAnnotation'
> & {
  typeAnnotation:
    | (ESTree.TSTypeAnnotation & { typeAnnotation: { type: string } })
    | null
    | undefined;
};

const noParamDestructure: Rule = {
  createOnce(context) {
    return {
      before() {
        if (context.filename.includes('/components/ui/')) {
          return false;
        }
      },
      FunctionDeclaration(node) {
        for (const param of node.params) {
          if (param.type === 'ObjectPattern') {
            context.report({
              node: param,
              message:
                'Destructure props in the function body, not in the parameter. Use `props: Type` then `const { ... } = props;`.',
            });
          }
        }
      },
    };
  },
};

const noInlinePropsType: Rule = {
  createOnce(context) {
    return {
      before() {
        if (context.filename.includes('/components/ui/')) {
          return false;
        }
      },
      FunctionDeclaration(node) {
        for (const param of node.params) {
          if (param.type !== 'Identifier') {
            continue;
          }
          const ident = param as IdentifierWithAnnotation;
          if (ident.typeAnnotation?.typeAnnotation.type === 'TSTypeLiteral') {
            context.report({
              node: param,
              message:
                'Extract inline prop types into a named type. Use `type FooProps = { ... }` then `props: FooProps`.',
            });
          }
        }
      },
    };
  },
};

export default definePlugin({
  meta: {
    name: 'maily',
  },
  rules: {
    'no-param-destructure': noParamDestructure,
    'no-inline-props-type': noInlinePropsType,
  },
});
