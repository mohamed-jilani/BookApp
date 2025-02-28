import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppSelector = useSelector; // Ancienne version de la ligne ci-dessus
// export const useAppDispatch = useDispatch; // Ancienne version de la ligne ci-dessus
