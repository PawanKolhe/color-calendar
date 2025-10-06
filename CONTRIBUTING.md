# Contributing to Color Calendar 🎨

Thank you for your interest in contributing to Color Calendar! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Using Storybook for Development](#using-storybook-for-development)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Building](#building)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

This project follows a code of conduct that ensures a welcoming environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started 🚀

### Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Version 8 or higher (this project uses pnpm as the package manager)
- **Git**: For version control

### Installation

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/color-calendar.git
   cd color-calendar
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Verify the setup**:
   ```bash
   pnpm test
   pnpm build
   ```

## Development Setup ⚙️

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm start:js` | Start Rollup in watch mode for JavaScript bundling |
| `pnpm start:css` | Start Gulp in watch mode for CSS compilation |
| `pnpm build` | Build the project for production |
| `pnpm test` | Run the test suite |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:ci` | Run tests for CI environment |
| `pnpm storybook` | Start Storybook development server |
| `pnpm build-storybook` | Build Storybook for production |
| `pnpm format` | Format code using Biome |
| `pnpm lint` | Lint code using Biome |
| `pnpm check` | Run all checks (format + lint) |
| `pnpm type-check` | Run TypeScript type checking |

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Start development server**:
   ```bash
   # Terminal 3: Storybook (recommended for UI development)
   pnpm storybook
   ```

3. **Make your changes** and test them using Storybook

4. **Run tests** before committing:
   ```bash
   pnpm test
   pnpm type-check
   ```

## Using Storybook for Development 📚

**Storybook is the recommended way to develop and test UI changes** in this project. It provides an isolated environment where you can:

- View all calendar variants and themes
- Test different configurations interactively
- Develop new features with live reloading
- Test accessibility and responsive behavior
- Document new features with stories

### Starting Storybook

```bash
pnpm storybook
```

This will start Storybook on `http://localhost:6006` with hot reloading enabled.

### Available Stories

### Creating New Stories

When adding new features, create corresponding stories:

1. **For React features**: Add stories to `src/react/ColorCalendar.stories.tsx`
2. **For HTML features**: Add stories to `src/stories/Calendar.stories.tsx`

Example story structure:
```typescript
export const MyNewFeature: Story = {
  args: {
    // Story configuration
  },
  parameters: {
    docs: {
      description: {
        story: "Description of what this story demonstrates"
      }
    }
  }
};
```

### Storybook Best Practices

- **Use descriptive names** for stories that explain their purpose
- **Add documentation** in the `parameters.docs.description.story` field
- **Test edge cases** with dedicated stories
- **Use controls** to make stories interactive when possible
- **Group related stories** using proper naming conventions

## Project Structure 📁

```
color-calendar/
├── src/
│   ├── index.ts                 # Main Calendar class
│   ├── types.ts                 # TypeScript type definitions
│   ├── modules/                 # Core calendar modules
│   │   ├── day/                 # Day selection and rendering
│   │   ├── events/              # Event management
│   │   ├── header/              # Header and navigation
│   │   ├── picker/              # Month/year pickers
│   │   └── weekday/             # Weekday display
│   ├── react/                   # React wrapper component
│   │   ├── ColorCalendar.tsx    # Main React component
│   │   ├── ColorCalendar.stories.tsx
│   │   └── ColorCalendar.test.tsx
│   ├── sass/                    # SCSS stylesheets
│   │   ├── theme-basic.scss
│   │   ├── theme-glass.scss
│   │   └── layouts/
│   └── stories/                 # Storybook stories
│       ├── Calendar.stories.tsx # HTML stories
│       ├── DynamicEvents.ts     # Event generation utilities
│       └── HTMLCalendarWrapper.tsx
├── dist/                        # Built files (generated)
├── storybook-static/            # Built Storybook (generated)
├── .storybook/                  # Storybook configuration
├── package.json
├── rollup.config.js             # Build configuration
├── vitest.config.ts            # Test configuration
└── tsconfig.json               # TypeScript configuration
```

## Development Workflow 🔄

### 1. Feature Development

1. **Plan your feature**:
   - Check existing issues and discussions
   - Consider both React and HTML implementations
   - Plan the API design

2. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Develop with Storybook**:
   - Start Storybook: `pnpm storybook`
   - Create stories for your feature
   - Test different configurations
   - Ensure accessibility compliance

4. **Write tests**:
   - Add unit tests for core functionality
   - Add integration tests for React component
   - Test edge cases and error conditions

5. **Update documentation**:
   - Update README.md if needed
   - Add JSDoc comments to new functions
   - Update type definitions

### 2. Bug Fixes

1. **Reproduce the issue**:
   - Create a minimal reproduction case
   - Test in both React and HTML versions
   - Document the expected vs actual behavior

2. **Fix the issue**:
   - Make the minimal necessary changes
   - Add tests to prevent regression
   - Update stories if UI changes are involved

3. **Test thoroughly**:
   - Run the full test suite
   - Test in Storybook
   - Test in different browsers

## Coding Standards ✨

### TypeScript

- **Use strict typing**: Avoid `any` types when possible
- **Export types**: Make types available for consumers
- **Use interfaces**: For object shapes and configurations
- **JSDoc comments**: Document public APIs

### Code Style

This project uses **Biome** for code formatting and linting:

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run all checks
pnpm check
```

### Naming Conventions

- **Files**: kebab-case (`my-feature.ts`)
- **Functions**: camelCase (`myFunction`)
- **Classes**: PascalCase (`MyClass`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Types/Interfaces**: PascalCase (`MyType`)

### Commit Messages

This project uses **Conventional Commits**:

```
type(scope): description

feat(react): add null selectedDate support
fix(calendar): resolve month navigation issue
docs(readme): update installation instructions
test(day): add tests for null selection
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Testing 🧪

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for CI
pnpm test:ci
```

### Test Structure

- **Unit tests**: Test individual functions and methods
- **Integration tests**: Test component interactions
- **Storybook tests**: Visual regression and interaction testing

### Writing Tests

1. **Test files**: Use `.test.ts` or `.test.tsx` extensions
2. **Test location**: Co-locate with source files
3. **Test coverage**: Aim for high coverage of critical paths
4. **Test naming**: Use descriptive test names

Example:
```typescript
describe('Calendar', () => {
  it('should handle null selectedDate correctly', () => {
    const calendar = new Calendar({ initialSelectedDate: null });
    expect(calendar.getSelectedDate()).toBeNull();
  });
});
```

## Building 🔨

### Development Build

```bash
# Build JavaScript and CSS
pnpm build

# Build only JavaScript (watch mode)
pnpm start:js

# Build only CSS (watch mode)
pnpm start:css
```

### Production Build

```bash
# Clean and build
pnpm prebuild && pnpm build

# Build Storybook
pnpm build-storybook
```

### Build Output

- **JavaScript**: `dist/bundle.js`, `dist/bundle.esm.js`, `dist/bundle.cjs.js`
- **CSS**: `dist/css/theme-basic.css`, `dist/css/theme-glass.css`
- **Types**: `dist/index.d.ts`, `dist/react/index.d.ts`
- **Storybook**: `storybook-static/`

## Submitting Changes 📤

### Pull Request Process

1. **Ensure your branch is up to date**:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run all checks**:
   ```bash
   pnpm check
   pnpm test
   pnpm type-check
   pnpm build
   ```

3. **Create a Pull Request**:
   - Use a descriptive title
   - Reference any related issues
   - Provide a detailed description
   - Include screenshots for UI changes
   - Link to relevant Storybook stories

### PR Template

GitHub will automatically load a comprehensive PR template when you create a new pull request. The template includes:

- **Description and change type** classification
- **Testing checklist** with Storybook verification
- **Code quality** and documentation checks
- **Accessibility** and performance considerations
- **Breaking changes** documentation
- **Reviewer guidelines** for maintainers

The template is located at `.github/pull_request_template.md` and will be automatically used by GitHub.

## Release Process 🚀

### Version Bumping

This project uses semantic versioning (SemVer):

- **Patch** (x.x.X): Bug fixes, documentation updates
- **Minor** (x.X.x): New features, non-breaking changes
- **Major** (X.x.x): Breaking changes

### Release Checklist

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new features and fixes
3. **Run full test suite** and ensure all tests pass
4. **Build and test** the production build
5. **Create release** on GitHub
6. **Publish to npm** (maintainers only)

## Getting Help 💬

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check the README.md and inline code documentation
- **Storybook**: Use the live examples in Storybook for reference

## Recognition 🏆

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation (for major contributions)

Thank you for contributing to Color Calendar! 🎉
