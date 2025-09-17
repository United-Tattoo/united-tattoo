# UI & shadcn/ui Rules

## Usage Order
1) Check shadcn registry (verify via Context7)  
2) Compose/extend with variants  
3) Custom only if primitives can’t express it

## Constraints
- Do not hack internal classes or override CSS
- Use `cva()` and `cn()` utilities
- Follow shadcn prop/naming conventions

## Variants & Composition
```tsx
<Button variant="destructive" size="lg" className="w-full">Delete</Button>
<Card><CardHeader>Title</CardHeader><CardContent><Button>Go</Button></CardContent></Card>